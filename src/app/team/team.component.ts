import {
  Component, OnDestroy, OnInit, ViewChild, ViewContainerRef
} from '@angular/core';
import {TeamService} from './shared/team.service';
import {ModalDirective} from 'ngx-bootstrap';
import * as moment from 'moment';
import {UserService} from "../core/user.service";

@Component({
  selector: 'team',
  templateUrl: './team.component.html'
})

export class TeamComponent implements OnInit {

  public p;
  @ViewChild('addModal') public addModal: ModalDirective;
  public user;
  constructor(public tService: TeamService, private vcr: ViewContainerRef, private uService: UserService) {
    this.tService.toastr.setRootViewContainerRef( this.vcr);
    // this.user = uService.vk;
    this.user = JSON.parse(sessionStorage.getItem('curUser'));
  }
  public data = [];
  public moment = moment;

  ngOnInit() {
    this.getUserTeams();
  }


  public check;
  public getPreffered(event) {
    this.check = event.target.checked;
  }

  public getUserTeams() {
    this.tService.getUserTeams(this.user.user_id).subscribe((data) => {
      this.data = data;
      console.log(typeof this.data);
    });
  }

  public save(form: any) {
    this.addModal.hide();
    this.tService.addAuction(form).subscribe((data) => {
        if (data.response) {
          this.tService.flash(data.response, 'warning');
        } else {
          this.tService.flash('Аукцион успешно создан!', 'success');
          this.tService.fetchData();
        }
      }, (error) => {
        this.tService.flash('Произошла ошибка, попробуйте еще раз!', 'error');
      }
    );
  }

  public openModal() {
    this.addModal.show();
  }
}
