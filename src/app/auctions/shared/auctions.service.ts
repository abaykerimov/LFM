import {Injectable} from '@angular/core';
import {Headers, Http, URLSearchParams, Response, Jsonp} from '@angular/http';

import 'rxjs/add/operator/map';
import {AuthHttp} from 'angular2-jwt';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import {Subject} from 'rxjs/Subject';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import {ActivatedRoute, Router} from '@angular/router';
import {env} from "../../../.env";

@Injectable()
export class AuctionsService {
  public headers: Headers = new Headers({ 'Content-Type': 'application/json;charset=utf-8' });
  // private imgName = '';
  public paramsString = '';
  private url;
  private stateParams = {};

  private updateData = new Subject<boolean>();

  public vk = {
    app_id: 0,
    user_id: 0,
    auth_key: '',
    app_secret: 'yrqoSBU4JX8ZXY2jsiHg'
  };

  public user = {
    id: 0,
    first_name: '',
    last_name: ''
  };
  constructor(private http: Http, public toastr: ToastsManager, private route: ActivatedRoute, private jsonp: Jsonp) {
    this.url = env('apiUrl');
    this.resetParams();
    this.getUserData();
  }

  public getUserData() {
    return this.route.queryParams.subscribe(
      params => {
        this.vk.app_id = params['api_id'];
        this.vk.user_id = params['viewer_id'];
        this.vk.auth_key = params['auth_key'];
        this.getUser(this.vk);
        console.log(this.vk);

      });
  }

  public getUser(value: any) {
    let vk_api = 'https://api.vk.com/method/users.get?user_ids=' + value.user_id + '&v=5.68';
    let params = new URLSearchParams();
    params.set('callback', 'JSONP_CALLBACK');
    this.jsonp.get(vk_api, {search: params}).map(this.extractData).subscribe(data => {
      this.user.id = data.response[0].id;
      this.user.first_name = data.response[0].first_name;
      this.user.last_name = data.response[0].last_name;
      this.addUserToDB(this.user, value);
    });
  }

  private addUserToDB(body, data) {
    let item = JSON.parse(localStorage.getItem('curUser'));
    if (item === null) {
      localStorage.setItem('curUser', JSON.stringify(data));
      const params = JSON.stringify(body);
      return this.http.post(this.url + 'user', params, { headers: this.headers }).map(this.extractData).subscribe(data => {
        console.log(data);
      });
    }
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

  public getAuctions() {
    return this.http.get(this.url + 'auction').map(this.extractData);
  }

  public getOffersByAuction(id: any) {
    return this.http.get(this.url + 'offer/' + id).map(this.extractData);
  }
  public showAuction(id: any) {
    console.log(this.url + 'auction/' + id);
    return this.http.get(this.url + 'auction/' + id).map(this.extractData);
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

  public getTeams(title: string = '') {
    let path = this.url + 'teams';
    if (title !== '') {
      path = path + '?search=' + title;
    }
    console.log(path);
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
