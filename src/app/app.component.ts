import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Md5} from "ts-md5/dist/md5";
import {UserService} from "./user/user.service";

@Component({
  selector: 'app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit{
  public error;
  constructor(private route: ActivatedRoute){}
  ngOnInit() {
    return this.route.queryParams.subscribe(
      params => {
        this.error = params['error'];
      });
  }
}
