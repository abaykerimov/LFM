import {
  Component, OnDestroy, OnInit, ViewContainerRef
} from '@angular/core';
import {AuctionsService} from '../shared/auctions.service';
import {NgForm} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import * as moments from 'moment';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {Location} from '@angular/common';
import {UserService} from "../../user/user.service";
import {LaravelEchoService} from "../../core/laravel-echo.service";
import moment from "moment-timezone";

@Component({
  selector: 'auctions-show',
  templateUrl: './auctions-show.component.html'
})

export class AuctionsShowComponent implements OnInit, OnDestroy {
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
  public bookmark = [];
  constructor(private aucService: AuctionsService, private route: ActivatedRoute, private vcr: ViewContainerRef, private location: Location, private uService: UserService, protected echo: LaravelEchoService) {
    this.aucService.toastr.setRootViewContainerRef(this.vcr);
    this.user = JSON.parse(sessionStorage.getItem('curUser'));
  }

  ngOnInit() {
    this.showAuction();
    this.searchTeams();
    this.aucService.onFetchData().subscribe(() => this.getOffers());
    this.connectBroadcast();
    this.echo.subscribeToEcho();
  }

  ngOnDestroy() {
    this.aucService.echoSub.leave('offers');
  }

  protected showAuction() {
    this.sub = this.route.params.subscribe(
      params => {
        this.auction_id = params['id'];
        this.aucService.showAuction(this.auction_id).subscribe(
          (data) => {
            this.auction = data;
            this.aucService.getOffersByAuction(this.auction_id).subscribe(
              (data) => {
                this.offers = data;
                this.timer(this.offers);
              });
          });
      }
    );
  }

  protected getOffers() {
    this.aucService.getOffersByAuction(this.auction_id).subscribe(
      (data) => {
        this.offers = data;
      });
  }

  protected save(form: NgForm) {
    form.value.auction_id = this.auction_id;
    form.value.team_id = this.team.id;
    form.value.user_id = this.user['user_id'];
    form.value.auction_title = this.auction.player.title;
    if (this.alert.type === 'success') {
      this.aucService.addOffer(form.value).subscribe((data) => {
          this.aucService.flash('Ставка сделана!', 'success');
          this.aucService.fetchData();
          form.reset();
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
  protected timer(offer: any) {
    this.finishTime =   moment.utc(this.auction['created_at']).add(20, 'm');
    if (offer.length > 0) {
      this.finishTime = moment.utc(offer[0].created_at).add(20, 'm');
    }

    if (moment().isAfter(this.finishTime.local())) {
      this.alert.type = 'time-is-over';
      if (offer.length > 0) {
        this.alert.text = this.auction.player['title'] + ' переходит в ' + offer[0].team.title + ' за ' + offer[0].cost + ' млн.';
      } else {
        this.alert.text = this.auction.player['title'] + ' переходит в ' + this.auction.team.title + ' за ' + this.auction.initial_cost + ' млн.';
      }
      if (this.auction.final_cost === 0) {
        this.updateAuction();
        this.updatePlayer();
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
    this.aucService.updateAuction(body, this.auction_id).subscribe();
  }

  protected updatePlayer() {
    let body = {
      team_id: this.auction['team_id']
    };
    if (this.offers.length > 0) {
      body.team_id = this.offers[0].team_id;
    }
    this.aucService.updatePlayer(body, this.auction.player['id']).subscribe();
  }

  goBack() {
    this.location.back();
  }

  protected connectBroadcast() {
    this.echo.echo.subscribe((echo) => {
      if (echo) {
        echo.channel('offers')
          .listen('.offer', (e) => {
            this.getOffers();
          });
      }
    });
  }
}
