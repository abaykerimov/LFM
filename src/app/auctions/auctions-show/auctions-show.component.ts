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
import {UserService} from "../../user/user.service";

@Component({
  selector: 'auctions-show',
  templateUrl: './auctions-show.component.html'
})

export class AuctionsShowComponent implements OnInit {
  protected moment = moment;
  private sub: any;
  public auction;
  private auction_id;
  public offers = [];
  public team = {
    all: [],
    id: 0,
    title: ''
  };
  private searchTerms = new Subject<string>();
  private user;
  constructor(private aucService: AuctionsService, private route: ActivatedRoute, private vcr: ViewContainerRef, private location: Location, private uService: UserService) {
    this.aucService.toastr.setRootViewContainerRef(this.vcr);
    this.user = JSON.parse(sessionStorage.getItem('curUser'));
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
        this.auction_id = params['id'];
        this.aucService.showAuction(this.auction_id).subscribe(
          (data) => {
            this.auction = data;
          });
      }
    );
  }

  protected getOffers() {
    if (this.auction_id !== 0) {
      this.aucService.getOffersByAuction(this.auction_id).subscribe(
        (data) => {
          this.offers = data;
          console.log(data);
          this.aucService.flash('Комментарии загружены', 'success');
          this.timer();
        });
    }
  }

  protected save(form: NgForm) {
    form.value.auction_id = this.auction_id;
    form.value.team_id = this.team.id;
    form.value.user_id = this.user['user_id'];
    if (this.alert.type === 'success') {
      this.aucService.addOffer(form.value).subscribe((data) => {
          this.aucService.flash('Ставка сделана!', 'success');
          this.aucService.fetchData();
          // form.reset();
        }, (error) => {
          this.aucService.flash('Произошла ошибка, попробуйте еще раз!', 'error');
        }
      );
    } else {
      this.aucService.flash('Стоимость не должна быть меньше предыдущей!', 'error');
    }
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

  public addBookmark() {
    let body = {
      user_id: this.user.user_id,
      auction_id: this.auction.id
    };
    this.aucService.addBookmark(body).subscribe(data => {
      this.aucService.flash('Добавлено в Избранные', 'success');
    }, error => {
      this.aucService.flash('Произошла ошибка', 'danger');
    });
  }

  public alert = {
    type: '',
    text: ''
  };

  protected checkCost(event, value) {
    let temp;
    if (value.length === 0) {
      temp = this.auction['initial_cost'];
    } else {
      temp = this.offers[0].cost;
    }
    if (event < temp) {
      this.alert.type = 'cost-error';
    } else {
      this.alert.type = 'success';
    }
  }

  private finishTime;
  protected timer() {
    this.finishTime = moment(this.auction['created_at']).add(20, 'm');
    if (this.offers.length > 0) {
      this.finishTime = moment(this.offers[0].created_at).add(20, 'm');
    }

    if (moment() > this.finishTime) {
      this.alert.type = 'time-is-over';
      if (this.offers.length > 0) {
        this.alert.text = this.auction.player['title'] + ' переходит в ' + this.offers[0].team.title + ' за ' + this.offers[0].cost + ' млн.';
      } else {
        this.alert.text = this.auction.player['title'] + ' переходит в ' + this.auction.team.title + ' за ' + this.auction.initial_cost + ' млн.';
      }
    }
  }

  protected updateAuction() {
    let body = {
      final_cost: this.auction.initial_cost
    };
    if (this.offers.length > 0) {
      body.final_cost = this.offers[0].cost;
    }
    this.aucService.updateAuction(body, this.auction_id).subscribe(data => {

    });
  }
  goBack() {
    this.location.back();
  }
}
