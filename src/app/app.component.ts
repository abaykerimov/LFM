import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {AuctionsService} from "./auctions/shared/auctions.service";
import {Md5} from "ts-md5/dist/md5";

@Component({
  selector: 'app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  private token;
  constructor(protected aucService: AuctionsService, private router: Router) {
    // this.token = Md5.hashStr(aucService.vk.app_id + '_' + aucService.vk.user_id + '_' + aucService.vk.app_secret);
    // console.log(this.token);
    // console.log(aucService.vk);
  }
}
