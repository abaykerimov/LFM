import {NgModule } from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {HttpModule, JsonpModule} from '@angular/http';
import {routes} from './app-routing.module';

import {AppComponent} from './app.component';
import {AuctionsModule} from './auctions/auctions.module';
import {PreloadAllModules, RouterModule} from '@angular/router';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {UserService} from "./core/user.service";
import * as $ from 'jquery';
import {CoreModule} from "./core/core.module";
import {AlertModule, ModalModule} from "ngx-bootstrap";

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    JsonpModule,
    AuctionsModule,
    RouterModule.forRoot(routes, { useHash: false, preloadingStrategy: PreloadAllModules }),
    CoreModule,
    ModalModule.forRoot(),
    AlertModule.forRoot(),
  ],
  declarations: [
    AppComponent,
  ],
  bootstrap: [AppComponent],
  providers: []
})
export class AppModule {
}
