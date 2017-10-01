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

@Component({
  selector: 'auctions',
  templateUrl: './auctions.component.html'
})

export class AuctionsComponent implements OnInit {

  @ViewChild('addModal') public addModal: ModalDirective;
  constructor(protected aucService: AuctionsService, private router: Router, private vcr: ViewContainerRef) {
    this.aucService.toastr.setRootViewContainerRef( this.vcr);
  }
  public data = [];
  protected moment = moment;
  private searchTerms = new Subject<string>();
  public player = {
    all: [],
    id: 0,
    title: '',
    team: '',
    position: '',
    skill: 0,
    age: 0,
    cost: 0
  };
  public team = {
    all: [],
    id: 0,
    title: ''
  };
  ngOnInit() {
    this.getAuctions();
    this.searchPlayers();
    this.searchTeams();
    this.aucService.onFetchData().subscribe(() => this.getAuctions());
  }

  protected getAuctions() {
    this.aucService.getAuctions().subscribe((data) => {
      this.data = data;
      console.log(this.data);
    });
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
          arr.push({id: item.id, text: `<a class="select-items" href=https://sofifa.com/player/${item.id} target="_blank"><span class="glyphicon glyphicon-link"></span></a> ${item.title}`, position: item.position, skill: item.skill, age: item.age, team: item.team[0].title});
        });
      }
      this.player.all = arr;
      console.log(this.player.all);
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
      console.log(this.team.all);
    });
    this.search(' ');
  }
  public search(value: any = '') {
    this.searchTerms.next(value);
  }
  public save(form: NgForm) {
    form.value.auctions_option_id = 1;
    form.value.title = this.player.title;
    form.value.description = 'Из ' + this.player.team + ' в ' + this.team.title + ' за ' + this.player.cost + ' млн.';
    form.value.player_id = this.player.id;
    form.value.team_id = this.team.id;
    form.value.initial_cost = this.player.cost;
    form.value.user_id = this.aucService.user.id;
    console.log(form.value);
    this.aucService.addAuction(form.value).subscribe((data) => {
        this.addModal.hide();
        this.aucService.flash('Аукцион успешно создан!', 'success');
        this.aucService.fetchData();
        form.reset();
        // this.router.navigate(['/auction/' + this.respData.id]);
      }, (error) => {
        this.aucService.flash('Произошла ошибка, попробуйте еще раз!', 'error');
      }
    );
  }

  public openModal() {
    this.addModal.show();
  }

  public setItem(type, event) {
    if (type === 'player') {
      for (let item of this.player.all) {
        if (item.id === event.id) {
          this.player.id = event.id;
          this.player.title = event.text;
          this.player.position = item.position;
          this.player.skill = item.skill;
          this.player.age = item.age;
          this.player.team = item.team;
          this.calculateCost();
        }
      }
    } else {
      this.team.id = event.id;
      this.team.title = event.text;
    }
  }

  protected calculateCost() {
    let result = ((Math.pow(this.player.skill, 4)) / ( ((100 - this.player.skill) / this.player.skill) * (110 - this.player.skill) ));
    if (this.player.position === 'CB') {
      result *= 2;
    }
    if (this.player.position === 'RB' || this.player.position === 'LB') {
      result *= 2.2;
    }
    if (this.player.position === 'RWB' || this.player.position === 'LWB') {
      result *= 2.4;
    }
    if (this.player.position === 'CDM') {
      result *= 2.5;
    }
    if (this.player.position === 'CM') {
      result *= 2.7;
    }
    if (this.player.position === 'RM' || this.player.position === 'LM') {
      result *= 2.9;
    }
    if (this.player.position === 'RW' || this.player.position === 'LW') {
      result *= 3.2;
    }
    if (this.player.position === 'CAM') {
      result *= 3.3;
    }
    if (this.player.position === 'ST' || this.player.position === 'CF' || this.player.position === 'LF' || this.player.position === 'RF') {
      result *= 3.5;
    }
    result *= ((35 - this.player.age) * 0.1);
    if (result > 120000000) {
      result = 120000000;
    }
    if (result === 0 || result < 0) {
      result = 1;
    }

    this.player.cost = Math.round(result / 1000000);
  }
}
