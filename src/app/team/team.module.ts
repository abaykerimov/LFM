import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';

import {TeamComponent} from './team.component';
import {TeamService} from './shared/team.service';
import {routing} from './team.routing';
import {AlertModule, ModalModule} from 'ngx-bootstrap';
import {SelectModule} from 'ng2-select';
import {ToastModule} from 'ng2-toastr';
import {CommonModule} from '@angular/common';
import { SpinnerModule } from 'angular2-spinner/src';
import {NgxPaginationModule} from 'ngx-pagination';
import { NKDatetimeModule } from 'ng2-datetime/ng2-datetime';
import {DateTimePickerDirective} from "ng2-eonasdan-datetimepicker/dist/datetimepicker.directive";

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
    TeamComponent
    // DateTimePickerDirective
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TeamComponent
  ],
  providers: [TeamService],
})
export class TeamModule {
}
