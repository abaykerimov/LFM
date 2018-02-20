import {
  Component, OnDestroy, OnInit, ViewChild, ViewContainerRef
} from '@angular/core';
import {TransfersService} from './shared/transfers.service';
import * as moment from 'moment';
import {UserService} from "../core/user.service";
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import {Location} from '@angular/common';
import {ModalDirective} from 'ngx-bootstrap';
import {LaravelEchoService} from "../core/laravel-echo.service";

@Component({
  selector: 'transfers',
  templateUrl: './transfers.component.html',
  styleUrls: ['transfers.component.css']
})

export class TransfersComponent implements OnInit, OnDestroy {

  public user;
  public transfers = [];
  public userTransfers = [];
  public requestTransfers = [];

  @ViewChild('addModal') public addModal: ModalDirective;

  constructor(public trService: TransfersService, private vcr: ViewContainerRef, private uService: UserService, private location: Location, protected echo: LaravelEchoService) {
    this.trService.toastr.setRootViewContainerRef( this.vcr);
    this.user = JSON.parse(sessionStorage.getItem('curUser'));
  }
  public moment = moment;

  ngOnInit() {
    this.getTransfers();
    this.getUserTransfers();
    this.getRequestTransfers();
    this.echo.subscribeToEcho();
    this.transferBroadcast();
    this.trService.onFetchData().subscribe(() => this.transferBroadcast());
  }

  public transferBroadcast() {
    this.trService.echoSub.channel('transfers')
        .listen('.transfer', (e) => {
          this.getTransfers();
          this.getRequestTransfers();
          this.getUserTransfers();
        });
  }

  public getTransfers() {
    this.trService.getTransfers().subscribe((data) => {
      this.transfers = data;
    });
  }

  public getUserTransfers() {
    this.trService.getTransfers(this.user.user_id, '').subscribe((data) => {
      this.userTransfers = data;
    });
  }

  public getRequestTransfers() {
    this.trService.getTransfers(this.user.user_id, 1).subscribe((data) => {
      this.requestTransfers = data;
    });
  }

  public save(form: any) {
    this.addModal.hide();
    this.trService.addTransfer(form).subscribe((data) => {
          if (data.response) {
            this.trService.flash(data.response, 'warning');
          } else {
            this.trService.flash('Трансфер успешно создан!', 'success');
            this.trService.fetchData();
          }
        }, (error) => {
          this.trService.flash('Произошла ошибка, попробуйте еще раз!', 'error');
        }
    );
  }

  protected transferAction(status: string, data: any) {
    data.transfer_id = data.id;
    data.user_id = this.user.user_id;
    data.status = status;
    this.trService.addTransfer(data).subscribe((response) => {
      if (!response.response) {
        this.trService.flash('Трансфер успешно подтвержден!', 'success');
        this.trService.fetchData();
      }
    }, (error) => {
      this.trService.flash('Произошла ошибка, попробуйте еще раз!', 'error');
    });
  }

  public openModal() {
    this.addModal.show();
  }

  goBack() {
    this.location.back();
  }
  ngOnDestroy() {
    this.trService.echoSub.leave('transfers');
  }
}
