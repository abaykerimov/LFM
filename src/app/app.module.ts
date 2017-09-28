import {NgModule } from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';

import {routes} from './app-routing.module';

import {AppComponent} from './app.component';
import {HeroesModule} from './heroes/heroes.module';
import {AuctionsModule} from './auctions/auctions.module';
import {PreloadAllModules, RouterModule} from '@angular/router';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    HeroesModule,
    AuctionsModule,
    RouterModule.forRoot(routes, { useHash: false, preloadingStrategy: PreloadAllModules })
  ],
  declarations: [
    AppComponent,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
