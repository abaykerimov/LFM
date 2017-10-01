import {
  Component, OnInit, ViewContainerRef
} from '@angular/core';
import {AuctionsService} from '../shared/auctions.service';
import {NgForm} from '@angular/forms';
import {ActivatedRoute, ParamMap} from '@angular/router';
import * as moment from 'moment';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {Location} from '@angular/common';

@Component({
  selector: 'auctions-show',
  templateUrl: './auctions-show.component.html'
})

export class AuctionsShowComponent implements OnInit {
  protected moment = moment;
  private sub: any;
  public auction = {
    all: [],
    id: 0
  };
  public offers = [];
  public team = {
    all: [],
    id: 0,
    title: ''
  };
  private searchTerms = new Subject<string>();

  constructor(private aucService: AuctionsService, private route: ActivatedRoute, private vcr: ViewContainerRef, private location: Location) {
    this.aucService.toastr.setRootViewContainerRef(this.vcr);
  }

  ngOnInit() {
    this.showAuction();
    this.getOffers();
    this.searchTeams();
    this.aucService.onFetchData().subscribe(() => this.getOffers());
  }

  protected showAuction() {
    this.sub = this.route.params.subscribe(
      params => {
        this.auction.id = params['id'];
        this.aucService.showAuction(this.auction.id).subscribe(
          (data) => {
            this.auction.all = data;
            console.log(this.auction.all);
          });
      }
    );
  }

  protected getOffers() {
    if (this.auction.id !== 0) {
      this.aucService.getOffersByAuction(this.auction.id).subscribe(
        (data) => {
          this.offers = data;
          console.log(this.offers);
          this.timer();
        });
    }
  }

  protected save(form: NgForm) {
    form.value.auction_id = this.auction.id;
    form.value.team_id = this.team.id;
    form.value.user_id = 1111111111;
    console.log(form.value);
    this.aucService.addOffer(form.value).subscribe((data) => {
        this.aucService.flash('Ставка сделана!', 'success');
      }, (error) => {
        this.aucService.flash('Произошла ошибка, попробуйте еще раз!', 'error');
      }
    );
    this.aucService.fetchData();
  }

  protected searchTeams() {
    this.searchTerms
      .debounceTime(500)
      .switchMap(term => term
        ? this.aucService.getTeams(term)
        : Observable.of<any[]>([]))
      .catch(error => {
        return Observable.of<any[]>([]);
      }).subscribe((data) => {
      let arr = [];
      if (data.length > 0) {
        data.forEach((item) => {
          arr.push({id: item.id, text: item.title});
        });
      }
      this.team.all = arr;
      console.log(this.team.all);
    });
    this.search(' ');
  }

  protected search(value: any = '') {
    this.searchTerms.next(value);
  }

  protected setItem(event) {
    this.team.id = event.id;
    this.team.title = event.text;
  }

  public alert = {
    type: '',
    text: ''
  };

  protected checkCost(event) {
    if (event < this.offers[0].cost) {
      this.alert.type = 'cost-error';
      this.alert.text = 'Стоимость не должна быть меньше предыдущей!';
    } else {
      this.alert.text = '';
    }
  }

  private finishTime;
  protected timer() {
    this.finishTime = moment(this.auction.all['created_at']).add(10, 'm');
    if (this.offers.length > 0) {
      this.finishTime = moment(this.offers[0].created_at).add(10, 'm');
    }

    if (moment() > this.finishTime) {
      this.alert.type = 'time-is-over';
      this.alert.text = 'Время!';
    }
  }

  goBack() {
    this.location.back();
  }
}
