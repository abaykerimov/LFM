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
  public data = [];

  constructor(private aucService: AuctionsService, private route: ActivatedRoute, private vcr: ViewContainerRef, private location: Location) {
    this.aucService.toastr.setRootViewContainerRef(this.vcr);
  }

  ngOnInit() {
    this.route.paramMap
      .switchMap((params: ParamMap) => this.aucService.showAuction(+params.get('id')))
      .subscribe(data => {this.data = data; console.log(data)});
    this.showAuction();
  }

  protected showAuction() {
    this.sub = this.route.params.subscribe(
      params => {
        let id = params['id'];
        this.aucService.showAuction(id).subscribe(
          (data) => {
            this.data = data;
            console.log(this.data);
            if(data.length > 0) {
              this.aucService.flash('Данные успешно загружены', 'success');
            }
          });
      }
    );
  }

  goBack(){
    this.location.back();
  }
}
