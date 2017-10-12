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

        console.log(data);
        this.notification.sendNotification('Alert', {body: 'Тестирование HTML5 Notifications',icon: 'http://abay.dev.kerimov.kz/public/img/180px-Krysakun_cover2.jpg'});
      });
  }
  ngOnDestroy() {
    this.aucService.echoSub.leave('auctions');
  }
}
