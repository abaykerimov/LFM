import {
  Component, Input, OnInit, ViewContainerRef
} from '@angular/core';
import {AuctionsService} from '../shared/auctions.service';
import * as moment from 'moment';


@Component({
  selector: 'auctions-all',
  templateUrl: './auctions-all.component.html'
})

export class AuctionsAllComponent implements OnInit {

  public p;
  constructor(public aucService: AuctionsService, private vcr: ViewContainerRef) {
    this.aucService.toastr.setRootViewContainerRef( this.vcr);
  }
  public moment = moment;
  @Input() user;
  @Input() data;
  ngOnInit() {}
}
