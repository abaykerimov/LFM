import {Injectable} from '@angular/core';
import {Headers, Http, URLSearchParams, Response, Jsonp} from '@angular/http';

import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import {Subject} from 'rxjs/Subject';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import {ActivatedRoute, Router} from '@angular/router';
import {env} from "../../../.env";

@Injectable()
export class TransfersService {
  public headers: Headers = new Headers({ 'Content-Type': 'application/json;charset=utf-8' });
  public option = {
    id: 0,
    year: 0,
    starts: ''
  };
  public tournament;
  public paramsString = '';
  private url;
  private stateParams = {};

  private updateData = new Subject<boolean>();

  constructor(private http: Http, public toastr: ToastsManager) {
    this.url = env('apiUrl');
    this.resetParams();
    this.getOption().subscribe(data => {
      this.option.id = data.id;
      this.option.year = data.turnir_year;
      this.option.starts = data.started_at;
    });
    /*
    * ГЛОБАЛЬНАЯ ПЕРЕМЕННАЯ - ГОД И АУКЦИОН_OPTIONS_ID
    **/
  }

  public fetchData() {
    this.updateData.next(true);
  }

  public onFetchData() {
    return this.updateData;
  }

  public setParams(params: object = null) {
    let parameters = '?';
    if (params != null) {
      Object.assign(this.stateParams, params);
      for (let param in this.stateParams) {
        if (Array.isArray(this.stateParams[param])) {
          this.stateParams[param].forEach((item) => {
            let name = param + '[]=' + item + '&';
            parameters = parameters + name;
          });
        } else {
          let name = param + '=' + this.stateParams[param];
          parameters = parameters + name + '&';
        }
      }
    }
    return this.paramsString = parameters;
  }

  public getOption() {
    return this.http.get(this.url + 'option').map(this.extractData);
  }

  public getTransfers() {
    return this.http.get(this.url + 'transfer').map(this.extractData);
  }

  public getUserTeams(id: any) {
    return this.http.get(this.url + 'teams/' + id).map(this.extractData);
  }

  public updateAuction(body: any, id) {
    const params = JSON.stringify(body);
    return this.http.put(this.url + 'auction/' + id, params, { headers: this.headers }).map(this.extractData);
  }

  public addTransfer(body: any) {
    const params = JSON.stringify(body);
    return this.http.post(this.url + 'transfer', params, { headers: this.headers }).map(this.extractData);
  }

  public getPlayers(title: string = '') {
    let path = this.url + 'players';
    if (title !== '') {
      path = path + '?search=' + title;
    }
    return this.http.get(path).map(this.extractData).debounce(() => Observable.timer(500));
  }

  public getTeams(title: string = '') {
    let path = this.url + 'teams';
    if (title !== '') {
      path = path + '?search=' + title;
    }
    return this.http.get(path).map(this.extractData).debounce(() => Observable.timer(500));
  }


  public resetParams() {
    this.paramsString = '';
    this.stateParams = {};
  }

  protected extractData(res: Response) {
    return res.json() || {};
  }

  public flash(message: string, status: string) {
    let alert;
    if (status === 'success') {
      alert = this.toastr.success(message, '', {toastLife: 2000 });
    } else if (status === 'warning') {
      alert = this.toastr.warning(message, '', {toastLife: 2000});
    } else {
      alert = this.toastr.error(message, '', {toastLife: 3000});
    }
    return alert;
  }

}
