import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';

import {TransfersComponent} from './transfers.component';
import {TransfersService} from './shared/transfers.service';
import {routing} from './transfers.routing';
import {AlertModule, ModalModule} from 'ngx-bootstrap';
import {SelectModule} from 'ng2-select';
import {ToastModule} from 'ng2-toastr';
import {CommonModule} from '@angular/common';
import { SpinnerModule } from 'angular2-spinner/src';
import {NgxPaginationModule} from 'ngx-pagination';
import { NKDatetimeModule } from 'ng2-datetime/ng2-datetime';
import {DateTimePickerDirective} from "ng2-eonasdan-datetimepicker/dist/datetimepicker.directive";
import {AuctionsCalculatorComponent} from "../auctions/auctions-calculator/auctions-calculator.component";
import {AuctionsModule} from '../auctions/auctions.module';

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
    NKDatetimeModule,
    AuctionsModule
  ],
  declarations: [
    TransfersComponent
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TransfersComponent
  ],
  providers: [TransfersService],
})
export class TransfersModule {
}
