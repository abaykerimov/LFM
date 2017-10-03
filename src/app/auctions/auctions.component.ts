import {
  Component, OnInit, ViewChild, ViewContainerRef
} from '@angular/core';
import {AuctionsService} from './shared/auctions.service';
import {NgForm} from '@angular/forms';
import {Router} from '@angular/router';
import {ModalDirective} from 'ngx-bootstrap';
import * as moment from 'moment';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import {UserService} from "../user/user.service";

@Component({
  selector: 'auctions',
  templateUrl: './auctions.component.html'
})

export class AuctionsComponent implements OnInit {

  public p;
  @ViewChild('addModal') public addModal: ModalDirective;
  private user;
  constructor(protected aucService: AuctionsService, private vcr: ViewContainerRef, private uService: UserService) {
    this.aucService.toastr.setRootViewContainerRef( this.vcr);
    this.user = JSON.parse(sessionStorage.getItem('curUser'));
  }
  public data = [];
  protected moment = moment;
  private searchTerms = new Subject<string>();

  ngOnInit() {
    this.getAuctions();
    this.aucService.onFetchData().subscribe(() => this.getAuctions());
  }

  protected getAuctions() {
    this.aucService.getAuctions().subscribe((data) => {
      this.data = data;
      console.log(this.data);
    });
  }

  public search(value: any = '') {
    this.searchTerms.next(value);
  }
  public save(form: any) {
    console.log(form.value);
    this.aucService.addAuction(form).subscribe((data) => {
        this.addModal.hide();
        this.aucService.flash('Аукцион успешно создан!', 'success');
        this.aucService.fetchData();
        form.reset();
      }, (error) => {
        this.aucService.flash('Произошла ошибка, попробуйте еще раз!', 'error');
      }
    );
  }

  public openModal() {
    this.addModal.show();
  }
}
