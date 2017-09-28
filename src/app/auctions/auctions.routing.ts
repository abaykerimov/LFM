import {RouterModule, Routes} from '@angular/router';
//
// import {DashboardComponent} from './dashboard/dashboard.component';
import {AuctionsComponent} from './auctions.component';
import {AuctionsShowComponent} from './auctions-show/auctions-show.component';

const routes: Routes = [
  {path: '', redirectTo: 'auctions', pathMatch: 'full'},
  // {path: 'auctions/dashboard', component: DashboardComponent},
  {path: 'auctions/detail/:id', component: AuctionsShowComponent},
  {path: 'auctions', component: AuctionsComponent}
];

export const routing = RouterModule.forChild(routes);
