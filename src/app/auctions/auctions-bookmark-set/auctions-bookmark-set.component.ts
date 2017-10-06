import {
  Component, EventEmitter, Input, OnInit, Output, ViewContainerRef
} from '@angular/core';
import {AuctionsService} from '../shared/auctions.service';
import * as moment from 'moment';

@Component({
  selector: 'auctions-bookmark-set',
  templateUrl: './auctions-bookmark-set.component.html'
})

export class AuctionsBookmarkSetComponent {
  protected moment = moment;
  public offers = [];

  @Input() user_id;
  @Input() auction_id;
  @Input() isBookmark;
  @Input() user_auction_id;
  public isDeleted = false;
  @Output() onDeleted = new EventEmitter<boolean>();
  constructor(private aucService: AuctionsService, private vcr: ViewContainerRef) {
    this.aucService.toastr.setRootViewContainerRef(this.vcr);
  }

  public addBookmark() {
    let body = {
      user_id: this.user_id,
      auction_id: this.auction_id
    };
    this.aucService.addBookmark(body).subscribe(data => {
      if (Object.keys(data).length > 0){
        this.aucService.flash('Добавлено в Избранные', 'success');
      } else {
        this.aucService.flash('Вы уже добавили!', 'warning');
      }
    }, error => {
      this.aucService.flash('Произошла ошибка', 'danger');
    });
  }

  public deleteBookmark() {
    this.aucService.deleteBookmark(this.user_auction_id).subscribe(data => {
      this.aucService.flash('Удалено из Избранных', 'success');
      this.isDeleted = true;
      this.onDeleted.emit(this.isDeleted);
    });
  }
}
