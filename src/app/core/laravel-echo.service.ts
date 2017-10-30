import Echo from "laravel-echo";
import { Injectable } from '@angular/core';
import { env } from '../../.env';
import { Subject } from 'rxjs/Subject';
import {UserService} from "./user.service";


@Injectable()
export class LaravelEchoService {
  public echo = new Subject<any>();

  constructor() {
    this.subscribeToEcho();
    // if (Object.keys(user.vk).length > 0) {
    //   this.subscribeToEcho();
    // } else {
    //   this.echo.next(null);
    // }
  }

  public subscribeToEcho(){
    this.echo.next(
      new Echo({
        broadcaster: 'pusher',
        key: env('pusherKey'),
        cluster: env('pusherCluster'),
        encrypted: true
        // authEndpoint: env('pusherAuthEndpoint'),
        // auth: {
        //   headers: { Authorization: 'Bearer ' + this.auth.getToken() }
        // }
      })
    );
  }
}
