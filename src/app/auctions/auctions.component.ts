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

  private respData;
  @ViewChild('addModal') public addModal: ModalDirective;
  constructor(protected aucService: AuctionsService, private router: Router, private vcr: ViewContainerRef) {
    this.aucService.toastr.setRootViewContainerRef( this.vcr);
  }
  public data = [];
  protected moment = moment;
  private searchTerms = new Subject<string>();
  public players = [];
  public teams = [];
  ngOnInit() {
    this.getAuctions();
    // this.searchPlayers();
    this.searchTerms
      .debounceTime(1000)
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
      this.teams = arr;
      console.log(this.teams);
    });
    this.teamSearch(' ');
  }

  protected getAuctions() {
    this.aucService.getAuctions().subscribe((data) => {
      this.data = data;
      console.log(this.data);
      if (this.data.length > 0) {
        this.aucService.flash('Данные успешно загружены', 'success');
      }
    });
  }
  // protected searchPlayers() {
  //   this.searchTerms
  //     .debounceTime(1000)
  //     .switchMap(term => term
  //       ? this.aucService.getPlayers(term)
  //       : Observable.of<any[]>([]))
  //     .catch(error => {
  //       return Observable.of<any[]>([]);
  //     }).subscribe((data) => {
  //     let arr = [];
  //     if (data.length > 0) {
  //       data.forEach((item) => {
  //         arr.push({id: item.id, text: item.title});
  //       });
  //     }
  //     this.players = arr;
  //     console.log(this.players);
  //   });
  //   // this.playerSearch(' ');
  // }
  protected searchTeams() {
    this.searchTerms
      .debounceTime(1000)
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
      this.teams = arr;
      console.log(this.teams);
    });
    // this.playerSearch(' ');
  }
  protected teamSearch(value: any = '') {
    this.searchTerms.next(value);
  }
  protected save(form: NgForm) {
    this.aucService.addAuction(form.value).subscribe((data) => {
        this.addModal.hide();
        this.respData = data;
        this.aucService.flash('Аукцион успешно создан!', 'success');
        this.router.navigate(['/auction/' + this.respData.id]);
      }, (error) => {
        this.respData = error;
        this.aucService.flash('Произошла ошибка, попробуйте еще раз!', 'error');
      }
    );
  }

  public openModal() {
    this.addModal.show();
  }

  protected setPlayerItem(event) {}
}
