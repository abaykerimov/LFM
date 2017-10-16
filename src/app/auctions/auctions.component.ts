import {
  Component, OnDestroy, OnInit, ViewChild, ViewContainerRef
} from '@angular/core';
import {AuctionsService} from './shared/auctions.service';
import {ModalDirective} from 'ngx-bootstrap';
import * as moment from 'moment';
import {UserService} from "../user/user.service";
import {LaravelEchoService} from "../core/laravel-echo.service";

@Component({
  selector: 'auctions',
  templateUrl: './auctions.component.html'
})

export class AuctionsComponent implements OnInit {

  public p;
  @ViewChild('addModal') public addModal: ModalDirective;
  public user;
  constructor(public aucService: AuctionsService, private vcr: ViewContainerRef, private uService: UserService, protected echo: LaravelEchoService) {
    this.aucService.toastr.setRootViewContainerRef( this.vcr);
    this.user = JSON.parse(sessionStorage.getItem('curUser'));
  }
  public data = [];
  public moment = moment;

  ngOnInit() {
    this.getAuctions();
    this.aucService.onFetchData().subscribe(() => this.getAuctions());

    this.connectBroadcast();
    this.echo.subscribeToEcho();
  }

  protected connectBroadcast() {
    this.echo.echo.subscribe((echo) => {
      if (echo) {
        echo.channel('auctions')
          .listen('.auction', (e) => {
            console.log(e);
          });
      }
    });
  }

  public check;
  public getPreffered(event) {
    this.check = event.target.checked;
  }

  public getAuctions() {
    this.aucService.getAuctions().subscribe((data) => {
      this.data = data;
    });
  }

  public save(form: any) {
    this.addModal.hide();
    this.aucService.addAuction(form).subscribe((data) => {
        if (data.response) {
          this.aucService.flash(data.response, 'warning');
        } else {
          this.aucService.flash('Аукцион успешно создан!', 'success');
          this.aucService.fetchData();
        }
      }, (error) => {
        this.aucService.flash('Произошла ошибка, попробуйте еще раз!', 'error');
      }
    );
  }

  public openModal() {
    this.addModal.show();
  }
}
