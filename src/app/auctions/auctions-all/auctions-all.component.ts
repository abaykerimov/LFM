import {
  Component, Input, OnDestroy, OnInit, ViewContainerRef
} from '@angular/core';
import {AuctionsService} from '../shared/auctions.service';
import * as moment from 'moment';
import {NotificationService} from "../../core/notification.service";

@Component({
  selector: 'auctions-all',
  templateUrl: './auctions-all.component.html'
})

export class AuctionsAllComponent implements OnInit, OnDestroy {

  public p;
  constructor(public aucService: AuctionsService, private vcr: ViewContainerRef, private notification: NotificationService) {
    this.aucService.toastr.setRootViewContainerRef( this.vcr);
  }
  public moment = moment;
  @Input() user;
  @Input() data;
  ngOnInit() {
    this.auctionBroadcast();
    this.offerBroadcast();
  }

  public auctionBroadcast() {
    this.aucService.echoSub.channel('auctions')
      .listen('.auction', (e) => {
        this.aucService.getAuctions().subscribe(data => {
          this.data = data;
        });
      });
  }

  public offerBroadcast() {
    this.aucService.echoSub.channel('offers')
      .listen('.offer', (data) => {
          this.aucService.showAuction(data.offer.auction_id).subscribe(value => {
          if (Number(this.user.user_id) === Number(value.user_id)) {
            if (Number(value.user_id) !== Number(data.offer.user_id)) {
              this.notification.sendNotification('На ваш аукцион напали!', {
                body: data.offer.auction_title.replace(/<\/?[^>]+(>|$)/g, ""),
                icon: 'http://abay.dev.kerimov.kz/public/img/180px-Krysakun_cover2.jpg',
              }, data.offer.auction_id);
            }
          }
        });
      });
  }

  public auction_id;
  public auctionExpiredBroadcast() {
    this.aucService.echoSub.channel('expired')
      .listen('.expire', (e) => {
        this.auction_id = e.auction.id;
      });
  }
  ngOnDestroy() {
    this.aucService.echoSub.leave('auctions');
  }
}
