import {RouterModule, Routes} from '@angular/router';

import {DashboardComponent} from './dashboard/dashboard.component';
import {HeroesComponent} from './heroes.component';
import {HeroDetailComponent} from './hero-detail/hero-detail.component';

const routes: Routes = [
  {path: 'heroes/dashboard', component: DashboardComponent},
  {path: 'heroes/detail/:id', component: HeroDetailComponent},
  {path: 'heroes', component: HeroesComponent}
];

export const routing = RouterModule.forChild(routes);
