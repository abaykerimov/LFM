import {Component, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Md5} from "ts-md5/dist/md5";
import {UserService} from "./user/user.service";
import {ModalDirective} from 'ngx-bootstrap';
import {AuctionsService} from "./auctions/shared/auctions.service";
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit{
  public error;
  public param;
  @ViewChild('envelope') public addModal: ModalDirective;
  constructor(private route: ActivatedRoute, public aucService: AuctionsService, private vcr: ViewContainerRef, public uService: UserService){
    this.aucService.toastr.setRootViewContainerRef( this.vcr);
    this.param = JSON.stringify(this.uService.vk);
  }
  ngOnInit() {
    return this.route.queryParams.subscribe(
      params => {
        console.log(this.uService.vk, params);
        this.error = params['error'];
      });
  }

  public submit(form: NgForm) {
    this.addModal.hide();
    form.value.user_id = this.uService.vk.user_id;
    console.log(form.value);
    this.aucService.addReply(form.value).subscribe((data) => {
        this.aucService.flash('Ворон успешно отправлен в Цитадель!', 'success');
      }, (error) => {
        this.aucService.flash('Произошла ошибка, попробуйте еще раз!', 'error');
      }
    );
    form.reset();
  }

  public openModal() {
    this.addModal.show();
  }
}
