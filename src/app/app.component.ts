import {Component, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {Md5} from "ts-md5/dist/md5";
import {UserService} from "./core/user.service";
import {ModalDirective} from 'ngx-bootstrap';
import {AuctionsService} from "./auctions/shared/auctions.service";
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit{
  public user;
  @ViewChild('envelope') public addModal: ModalDirective;
  constructor(public aucService: AuctionsService, private vcr: ViewContainerRef, public uService: UserService){
    this.aucService.toastr.setRootViewContainerRef( this.vcr);
    this.user = JSON.parse(sessionStorage.getItem('curUser'));
    console.log(uService.vk);
  }
  ngOnInit() {
  }

  public submit(form: NgForm) {
    this.addModal.hide();
    form.value.user_id = this.user.user_id;
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
