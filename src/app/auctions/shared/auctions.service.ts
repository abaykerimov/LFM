import {Injectable} from '@angular/core';
import {Headers, Http, URLSearchParams, Response, Jsonp} from '@angular/http';

import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import {Subject} from 'rxjs/Subject';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import {ActivatedRoute, Router} from '@angular/router';
import {env} from "../../../.env";
import {LaravelEchoService} from "../../core/laravel-echo.service"

@Injectable()
export class AuctionsService {
  public headers: Headers = new Headers({ 'Content-Type': 'application/json;charset=utf-8' });
  // private imgName = '';
  public option = {
    id: 0,
    year: 0,
    starts: ''
  };
  public paramsString = '';
  private url;
  private stateParams = {};

  private updateData = new Subject<boolean>();
  public echoSub;

  constructor(private http: Http, public toastr: ToastsManager, protected echo: LaravelEchoService) {
    this.connectBroadcast();

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

  protected connectBroadcast() {
    this.echo.echo.subscribe((echo) => {
      if (echo) {
        console.log(echo);
        this.echoSub = echo;
      }
    });
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
      // console.log(this.stateParams);
      for (let param in this.stateParams) {
        if (Array.isArray(this.stateParams[param])) {
          this.stateParams[param].forEach((item) => {
            let name = param + '[]=' + item + '&';
            parameters = parameters + name;
          });
        } else {
          let name = param + '=' + this.stateParams[param];
          parameters = parameters + name + '&';

          console.log(this.stateParams[param]);
        }
      }
    }
    console.log(parameters);
    return this.paramsString = parameters;
  }

  public getBookmark(user_id, auction_id) {
    return this.http.get(this.url + 'getBookmark/' + user_id + '/' + auction_id).map(this.extractData);
  }

  public addBookmark(body: any) {
    const params = JSON.stringify(body);
    return this.http.post(this.url + 'bookmarks', params, { headers: this.headers }).map(this.extractData);
  }

  public deleteBookmark(id: any) {
    // let body = JSON.stringify({id: id});
    return this.http.delete(this.url + 'bookmarks/' + id, { headers: this.headers }).map(this.extractData);
  }

  public addOption(body: any) {
    const params = JSON.stringify(body);
    return this.http.post(this.url + 'option', params, { headers: this.headers }).map(this.extractData);
  }
  public getOption() {
    return this.http.get(this.url + 'option').map(this.extractData);
  }
  public getAuctions() {
    return this.http.get(this.url + 'auction').map(this.extractData);
  }

  public getUserBookmarks(id) {
    return this.http.get(this.url + 'bookmarks/' + id).map(this.extractData);
  }
  public getOffersByAuction(id: any) {
    return this.http.get(this.url + 'offer/' + id).map(this.extractData);
  }
  public showAuction(id: any) {
    console.log(this.url + 'auction/' + id);
    return this.http.get(this.url + 'auction/' + id).map(this.extractData);
  }

  public updateAuction(body: any, id) {
    const params = JSON.stringify(body);
    return this.http.put(this.url + 'auction/' + id, params, { headers: this.headers }).map(this.extractData);
  }
  // public uploadFile(event) {
  //   let fileList: FileList = event.target.files;
  //   console.log(fileList);
  //   if(fileList.length > 0) {
  //     let file: File = fileList[0];
  //     console.log(file);
  //     let formData:FormData = new FormData();
  //     formData.append('image', file, file.name);
  //     let path = this.webinarsUrl + 'webinar/upload/';
  //     return this.http.post(path, formData)
  //       .map(res => res.json())
  //       .catch(error => Observable.throw(error))
  //       .subscribe(
  //         data => {console.log(data); this.imgName = data; this.flash('Изображение успешно загружена!', 'success')},
  //         error => {this.flash('Размер изображение слишком велик или произошла ошибка', 'error')}
  //       )
  //   }
  // }
  //
  // public deleteClass(body) {
  //   return this.http.delete(this.url + 'webinar/class/' + body.id).map(this.extractData);
  // }

  // public updateWebinar(body, webinar) {
  //   console.log(this.imgName);
  //   if(this.imgName === '') {
  //     body.image = webinar.image;
  //   } else {
  //     body.image = this.imgName;
  //   }
  //   console.log(body);
  //   let path = this.webinarsUrl + 'webinars/' + webinar.id;
  //   const params = JSON.stringify(body);
  //   return this.http.put(path, params, { headers: this.headers }).map(this.extractData);
  // }
  public addAuction(body: any) {
    const params = JSON.stringify(body);
    return this.http.post(this.url + 'auction', params, { headers: this.headers }).map(this.extractData);
  }

  public addOffer(body: any) {
    const params = JSON.stringify(body);
    return this.http.post(this.url + 'offer', params, { headers: this.headers }).map(this.extractData);
  }

  public getPlayers(title: string = '') {
    let path = this.url + 'players';
    if (title !== '') {
      path = path + '?search=' + title;
    }
    return this.http.get(path).map(this.extractData).debounce(() => Observable.timer(500));
  }

  public updatePlayer(body: any, id) {
    const params = JSON.stringify(body);
    return this.http.put(this.url + 'players/' + id, params, { headers: this.headers }).map(this.extractData);
  }

  public getTeams(title: string = '') {
    let path = this.url + 'teams';
    if (title !== '') {
      path = path + '?search=' + title;
    }
    console.log(path);
    return this.http.get(path).map(this.extractData).debounce(() => Observable.timer(500));
  }

  public addReply(body: any) {
    const params = JSON.stringify(body);
    return this.http.post(this.url + 'reply', params, { headers: this.headers }).map(this.extractData);
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
