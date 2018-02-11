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

export class TransfersComponent implements OnInit {

  public user;
  public player = {
    all: [],
    id: 0,
    title: '',
    team: '',
    position: 'GK',
    skill: 80,
    age: 25,
    cost: 5
  };
  @ViewChild('addModal') public addModal: ModalDirective;

  constructor(public trService: TransfersService, private vcr: ViewContainerRef, private uService: UserService, private location: Location) {
    this.trService.toastr.setRootViewContainerRef( this.vcr);
    this.user = JSON.parse(sessionStorage.getItem('curUser'));
  }
  public userTeam = [];
  public moment = moment;
  private searchTerms = new Subject<string>();

  ngOnInit() {
    this.getUserTeams();
    this.searchPlayers();
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

  protected searchPlayers() {
    this.searchTerms
        .debounceTime(500)
        .switchMap(term => term
            ? this.trService.getPlayers(term)
            : Observable.of<any[]>([]))
        .catch(error => {
          return Observable.of<any[]>([]);
        }).subscribe((data) => {
          let arr = [];
          if (data.length > 0) {
            data.forEach((item) => {
              arr.push({id: item.id, text: item.title, position: item.position, skill: item.skill, date_of_birth: item.date_of_birth, team: item.team.title});
            });
          }
          this.player.all = arr;
        });
    this.search(' ');
  }

  public search(value: any = '') {
    this.searchTerms.next(value);
  }

  public setItem(type, event) {
    for (let item of this.player.all) {
      if (item.id === event.id) {
        this.player.id = event.id;
        this.player.title = event.text;
        this.player.position = item.position;
        this.player.skill = item.skill;
        this.player.age = this.trService.option.year - Number(moment(item.date_of_birth).format('YYYY'));
        this.player.team = item.team;
        this.calculateCost(this.player);
      }
    }
  }

  public getUserTeams() {
    this.trService.getUserTeams(this.user.user_id).subscribe((data) => {
      this.userTeam = data;
    });
  }

  protected calculateCost(value: any) {
    let result = ((Math.pow(value.skill, 4)) / ( ((100 - value.skill) / value.skill) * (110 - value.skill) ));
    if (value.position === 'CB') {
      result *= 2;
    }
    if (value.position === 'RB' || value.position === 'LB') {
      result *= 2.2;
    }
    if (value.position === 'RWB' || value.position === 'LWB') {
      result *= 2.4;
    }
    if (value.position === 'CDM') {
      result *= 2.5;
    }
    if (value.position === 'CM') {
      result *= 2.7;
    }
    if (value.position === 'RM' || value.position === 'LM') {
      result *= 2.9;
    }
    if (value.position === 'RW' || value.position === 'LW') {
      result *= 3.2;
    }
    if (value.position === 'CAM') {
      result *= 3.3;
    }
    if (value.position === 'ST' || value.position === 'CF' || value.position === 'LF' || value.position === 'RF') {
      result *= 3.5;
    }
    result *= ((35 - value.age) * 0.1);
    if (result > 120000000) {
      result = 120000000;
    }
    this.player.cost = Math.round(result / 1000000);
    if (this.player.cost === 0 || this.player.cost < 0) {
      this.player.cost = 1;
    }
  }


  public openModal() {
    this.addModal.show();
  }

  goBack() {
    this.location.back();
  }
}
