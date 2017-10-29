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
  public headers: Headers = new Headers({ 'Content-Type': 'application/json;charset=utf-8' });
  private url;

  public vk = {
    app_id: 0,
    user_id: 0,
    auth_key: '',
    api_result: '',
    viewer_type: 0,
    app_secret: 'oDzC4j9aIJlA0O1s3yUp' /* ПОМЕНЯТЬ ПОТОМ! */
  };

  public user;
  private token;

  constructor(private http: Http, private route: ActivatedRoute, private jsonp: Jsonp, private router: Router) {
    this.url = env('apiUrl');
    this.getUserData();
  }

  public getUserData() {
    this.route.queryParams.subscribe(
      params => {
        if (!params['type']) {
          if (Object.keys(params).length !== 0) {
            this.vk.app_id = params['api_id'];
            this.vk.user_id = params['viewer_id'];
            this.vk.auth_key = params['auth_key'];
            this.vk.api_result = params['api_result'];
            this.vk.viewer_type = params['viewer_type'];

            // this.user = JSON.parse(this.vk.api_result);
            // console.log(this.user.response[0]);

            sessionStorage.setItem('curUser', JSON.stringify(this.vk));
          } else {
            this.vk = JSON.parse(sessionStorage.getItem('curUser'));
          }
        } else {
          this.vk = JSON.parse(sessionStorage.getItem('curUser'));
        }

        this.getUser(this.vk).subscribe(data => {
          if (Object.keys(data).length === 0) {
            this.user = JSON.parse(this.vk.api_result);
            console.log(this.user.response);
            this.addUserToDB(this.user.response[0]);
            // this.getVKUser(this.vk).subscribe(data => {
            //   this.user = data.response[0];
            //   if (Object.keys(this.user).length !== 0) {
            //     this.addUserToDB(this.user);
            //   }
            // });
          } else {
            this.user = data;
          }
        });
        // this.checkUser(this.vk);
      });
  }

  public getUser(value: any) {
    let api = this.url + 'user/' + value.user_id;
    return this.http.get(api).map(this.extractData);
  }

  public getVKUser(value: any) {
    let vk_api = 'https://api.vk.com/method/users.get?user_ids=' + value.user_id + '&v=5.68';
    let params = new URLSearchParams();
    params.set('callback', 'JSONP_CALLBACK');
    return this.jsonp.get(vk_api, {search: params}).map(this.extractData);
  }

  private addUserToDB(body: any) {
    const params = JSON.stringify(body);
    this.http.post(this.url + 'user', params, { headers: this.headers }).map(this.extractData).subscribe();
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
