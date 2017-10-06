import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';

import {AuctionsComponent} from './auctions.component';
import {AuctionsShowComponent} from './auctions-show/auctions-show.component';
import {AuctionsService} from './shared/auctions.service';
import {routing} from './auctions.routing';
import {AlertModule, ModalModule} from 'ngx-bootstrap';
import {SelectModule} from 'ng2-select';
import {ToastModule} from 'ng2-toastr';
import {CommonModule} from '@angular/common';
import { SpinnerModule } from 'angular2-spinner/src';
import {NgxPaginationModule} from 'ngx-pagination';
import {AuctionsCalculatorComponent} from "./auctions-calculator/auctions-calculator.component";
import {AuctionsAssignComponent} from "./auctions-assign/auctions-assign.component";
import { NKDatetimeModule } from 'ng2-datetime/ng2-datetime';
import {DateTimePickerDirective} from "ng2-eonasdan-datetimepicker/dist/datetimepicker.directive";
import {AuctionsAllComponent} from "./auctions-all/auctions-all.component";
import {AuctionsBookmarkComponent} from "./auctions-bookmark/auctions-bookmark.component";
import {AuctionsBookmarkSetComponent} from "./auctions-bookmark-set/auctions-bookmark-set.component";

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
    SelectModule,
    SpinnerModule,
    NgxPaginationModule,
    NKDatetimeModule
  ],
  declarations: [
    AuctionsShowComponent,
    AuctionsComponent,
    AuctionsCalculatorComponent,
    AuctionsAssignComponent,
    AuctionsAllComponent,
    AuctionsBookmarkComponent,
    AuctionsBookmarkSetComponent
    // DateTimePickerDirective
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AuctionsComponent
  ],
  providers: [AuctionsService],
})
export class AuctionsModule {
}
