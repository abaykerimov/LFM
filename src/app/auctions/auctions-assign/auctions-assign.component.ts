import {
  Component, OnInit, ViewChild, ViewContainerRef
} from '@angular/core';
import {AuctionsService} from '../shared/auctions.service';
import {NgForm} from '@angular/forms';
import * as moment from 'moment';
import {UserService} from "../../user/user.service";
import {ModalDirective} from "ngx-bootstrap";

@Component({
  selector: 'auctions-assign',
  templateUrl: './auctions-assign.component.html'
})

export class AuctionsAssignComponent implements OnInit {

  protected user;
  @ViewChild('modal') public modal: ModalDirective;
  constructor(protected aucService: AuctionsService, private vcr: ViewContainerRef, private uService: UserService) {
    this.aucService.toastr.setRootViewContainerRef( this.vcr);
    this.user = JSON.parse(sessionStorage.getItem('curUser'));
  }
  public date;
  protected moment = moment;
  public datepickerOpts = {
    autoclose: true,
    todayBtn: 'linked',
    format: 'yyyy-mm-dd',
    placeholder: 'Дата аукциона'
  };
  ngOnInit() {
  }

  public save(form: NgForm) {
    form.value.started_at = moment(this.date).format('YYYY-MM-DD HH:mm:ss');
    form.value.user_id = this.user['user_id'];
    this.modal.hide();
    this.aucService.addOption(form.value).subscribe((data) => {
        this.aucService.flash('Дата для аукциона установлена', 'success');
        form.reset();
      }, (error) => {
        this.aucService.flash('Произошла ошибка, попробуйте еще раз!', 'error');
      }
    );
  }

  public openModal() {
    this.modal.show();
  }
}
