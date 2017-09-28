import {ElementRef, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';

import {AuctionsComponent} from './auctions.component';
import {AuctionsShowComponent} from './auctions-show/auctions-show.component';
import {AuctionsService} from './shared/auctions.service';
import {routing} from './auctions.routing';
import {AlertModule, ModalDirective, ModalModule} from 'ngx-bootstrap';
import {SelectModule} from 'ng2-select';
import {ToastModule} from 'ng2-toastr';
import {CommonModule} from '@angular/common';

@NgModule({
  imports: [
    routing,
    CommonModule,
    ReactiveFormsModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    ModalModule.forRoot(),
    AlertModule.forRoot(),
    ToastModule.forRoot(),
    SelectModule
  ],
  declarations: [
    AuctionsShowComponent,
    AuctionsComponent
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [AuctionsService],
})
export class AuctionsModule {
}
