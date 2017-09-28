import {
  Component, OnInit, ViewContainerRef
} from '@angular/core';
import {AuctionsService} from '../shared/auctions.service';
import {NgForm} from '@angular/forms';
import {ActivatedRoute, ParamMap} from '@angular/router';
import * as moment from 'moment';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';

@Component({
  selector: 'auctions-show',
  templateUrl: './auctions-show.component.html',
  // styleUrls: ['./webinars-edit.component.css']
})

export class AuctionsShowComponent implements OnInit {
  protected moment = moment;
  private sub: any;
  public data = [];
  // private searchTerms = new Subject<string>();

  constructor(private aucService: AuctionsService, private route: ActivatedRoute, private vcr: ViewContainerRef) {
    this.aucService.toastr.setRootViewContainerRef(this.vcr);
  }

  ngOnInit() {
    this.route.paramMap
      .switchMap((params: ParamMap) => this.aucService.showAuction(+params.get('id')))
      .subscribe(data => {this.data = data; console.log(data)});
    // this.showAuction();
    // this.searchClass();
  }

  // protected searchClass() {
  //   this.searchTerms
  //     .debounceTime(1000)
  //     .switchMap(term => term
  //       ? this.webService.getClasses(term)
  //       : Observable.of<any[]>([]))
  //     .catch(error => {
  //       return Observable.of<any[]>([]);
  //     }).subscribe((data) => {
  //     let arr = [];
  //     if (data.length > 0){
  //       data.forEach((item) => {
  //         arr.push({id: item.id, text: `<a class="select-items" href='/webinars/${item.id}/edit'><i class="fa fa-link"></i></a> ${item.title}`});
  //       });
  //     }
  //     this.classes.all = arr;
  //     console.log(this.classes.all);
  //   });
  //   this.classSearch(" ");
  // }

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
  //
  // protected getTrainings() {
  //   this.aucService.getTrainings().subscribe(
  //     (data) => {
  //       data.forEach(item => {
  //         item.text = `<a class="select-items" href='/webinars/${item.id}/edit'><i class="fa fa-link"></i></a> ${item.text}`;
  //       });
  //       this.training.all = data;
  //     }
  //   );
  // }

  // protected classSearch(value:any = ""){
  //   this.searchTerms.next(value);
  // }
  //

  //
  // protected setTrainingItem(event) {
  //   this.training.item = event.id;
  // }
}
