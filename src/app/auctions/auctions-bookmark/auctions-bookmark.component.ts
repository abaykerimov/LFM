import {
  Component, OnInit, ViewContainerRef, Input
} from '@angular/core';
import {AuctionsService} from '../shared/auctions.service';
import * as moment from 'moment';

@Component({
  selector: 'auctions-bookmark',
  templateUrl: './auctions-bookmark.component.html'
})

export class AuctionsBookmarkComponent implements OnInit {

  public p;
  public isBookmark = true;
  @Input() user;
  constructor(public aucService: AuctionsService, private vcr: ViewContainerRef) {
    this.aucService.toastr.setRootViewContainerRef( this.vcr);
  }
  public data = [];
  public moment = moment;
  ngOnInit() {
    this.getUserBookmarks();
  }

  public getUserBookmarks() {
    this.user.user_id = Number(this.user.user_id);
    this.aucService.getUserBookmarks(this.user.user_id).subscribe(data => {
      this.data = data;
      this.aucService.flash('Избранные загружены', 'success');
    });
  }

  onDeleted(event) {
    event ? this.getUserBookmarks() : false;
  }
}
