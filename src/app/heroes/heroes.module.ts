import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';

// Imports for loading & configuring the in-memory web api
import {InMemoryWebApiModule} from 'angular-in-memory-web-api';
import {InMemoryDataService} from './shared/in-memory-data.service';

import {DashboardComponent} from './dashboard/dashboard.component';
import {HeroesComponent} from './heroes.component';
import {HeroDetailComponent} from './hero-detail/hero-detail.component';
import {HeroService} from './shared/hero.service';
import {HeroSearchComponent} from './hero-search/hero-search.component';
import {routing} from './heroes.routing';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    InMemoryWebApiModule.forRoot(InMemoryDataService),
    routing
  ],
  declarations: [
    DashboardComponent,
    HeroDetailComponent,
    HeroesComponent,
    HeroSearchComponent
  ],
  providers: [HeroService],
})
export class HeroesModule {
}
