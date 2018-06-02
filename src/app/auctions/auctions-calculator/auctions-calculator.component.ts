import {
  Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewContainerRef
} from '@angular/core';
import {AuctionsService} from '../shared/auctions.service';
import {NgForm} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {ModalDirective} from 'ngx-bootstrap';
import * as moment from 'moment';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import {UserService} from "../../core/user.service";
import {Location} from '@angular/common';

@Component({
  selector: 'auctions-calculator',
  templateUrl: './auctions-calculator.component.html'
})

export class AuctionsCalculatorComponent implements OnInit {

  private user;
  constructor(protected aucService: AuctionsService, private uService: UserService, private route: ActivatedRoute, private location: Location) {
    this.user = JSON.parse(sessionStorage.getItem('curUser'));
  }
  private searchTerms = new Subject<string>();
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
  public team = {
    all: [],
    id: 0,
    title: ''
  };
  @Input() userTeam;
  @Output() onSubmit = new EventEmitter<any>();
  @Output() onClose = new EventEmitter<any>();
  ngOnInit() {
    this.check();
    if (this.param === 'auction') {
      this.searchPlayers();
      this.searchTeams();
    } else if (this.param === 'transfer') {
      this.searchPlayers();
    }
  }

  protected transferType;
  transferTypeChanged(event) {
    this.transferType = event;
  }

  protected loanType;
  loanTypeChanged(event) {
    this.loanType = event;
  }

  submit(form: NgForm) {
    if (this.param === 'auction') {
      form.value.auction_option_id = this.aucService.option.id;
      form.value.description = 'Из ' + this.player.team + ' в ' + this.team.title + ' за ' + this.player.cost + ' млн.';
      form.value.player_id = this.player.id;
      form.value.team_id = this.team.id;
      form.value.initial_cost = this.player.cost;
      form.value.user_id = this.user['user_id'];
      this.onSubmit.emit(form.value);
      form.reset();
      this.player.id = 0;
    } else if(this.param === 'cost') {
      this.calculateCost(form.value);
    } else {
      form.value.auction_option_id = this.aucService.option.id;
      form.value.player_id = this.player.id;
      form.value.player_title = this.player.title;
      form.value.user_id = this.user['user_id'];
      this.onSubmit.emit(form.value);
      form.reset();
      this.player.id = 0;
    }
  }

  hide(form: NgForm){
    this.onClose.emit();
    form.reset();
    this.player.id = 0;
  }
  protected searchPlayers() {
    this.searchTerms
      .debounceTime(500)
      .switchMap(term => term
        ? this.aucService.getPlayers(term)
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
  protected searchTeams() {
    this.searchTerms
      .debounceTime(500)
      .switchMap(term => term
        ? this.aucService.getTeams(term)
        : Observable.of<any[]>([]))
      .catch(error => {
        return Observable.of<any[]>([]);
      }).subscribe((data) => {
      let arr = [];
      if (data.length > 0) {
        data.forEach((item) => {
          arr.push({id: item.id, text: item.title});
        });
      }
      this.team.all = arr;
    });
    this.search(' ');
  }
  public search(value: any = '') {
    this.searchTerms.next(value);
  }

  public setItem(type, event) {
    if (type === 'player') {
      for (let item of this.player.all) {
        if (item.id === event.id) {
          this.player.id = event.id;
          this.player.title = event.text;
          this.player.position = item.position;
          this.player.skill = item.skill;
          this.player.age = this.aucService.option.year - Number(moment(item.date_of_birth).format('YYYY'));
          this.player.team = item.team;
          this.calculateCost(this.player);
        }
      }
    } else {
      this.team.id = event.id;
      this.team.title = event.text;
    }
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

  plus(value) {
    value === 'skill' ? this.player.skill+=1 : this.player.age+=1;
  };

  minus(value) {
    value === 'skill' ? this.player.skill-=1 : this.player.age-=1;
  };

  public param: string;
  protected check(){
    this.route.queryParams.subscribe(params => {
      if (params['type'] === 'cost') {
        this.param = 'cost';
      } else if(params['type'] === 'transfer') {
        this.param = 'transfer';
      } else {
        this.param = 'auction';
      }
    });
  }

  goBack() {
    this.location.back();
  }
}
