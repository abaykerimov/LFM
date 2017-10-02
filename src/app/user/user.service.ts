import {Injectable} from '@angular/core';
import {Headers, Http, URLSearchParams, Response, Jsonp} from '@angular/http';

import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import {Subject} from 'rxjs/Subject';
import {ActivatedRoute, Router} from '@angular/router';
import {env} from "../../.env";
import {Md5} from "ts-md5/dist/md5";

@Injectable()
export class UserService {
  private url;

  public vk = {
    app_id: 0,
    user_id: 0,
    auth_key: '',
    app_secret: 'yrqoSBU4JX8ZXY2jsiHg' /* ПОМЕНЯТЬ ПОТОМ! */
  };

  public user = {
    id: 0,
    first_name: '',
    last_name: ''
  };
  private token;

  constructor(private http: Http, private route: ActivatedRoute, private jsonp: Jsonp, private router: Router) {
    this.url = env('apiUrl');
    if (this.vk.user_id === 0) {
      this.getUserData();
    }
  }

  public getUserData() {
    this.route.queryParams.subscribe(
      params => {
        this.vk.app_id = params['api_id'];
        this.vk.user_id = params['viewer_id'];
        this.vk.auth_key = params['auth_key'];
        this.getUser(this.vk);
        console.log(this.vk);
        // this.checkUser(this.vk);
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
      return this.http.post(this.url + 'user', params).map(this.extractData).subscribe(data => {
        console.log(data);
      });
    }
  }

  private checkUser(value: any) {
    this.token = Md5.hashStr(value.app_id + '_' + value.user_id + '_' + value.app_secret);
    if (this.token !== value.auth_key) {
      this.router.navigate(['/'], { queryParams: {error: 'auth-key-failed'} });
    }
  }

  protected extractData(res: Response) {
    return res.json() || {};
  }

}
