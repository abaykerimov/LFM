import {RouterModule, Routes} from '@angular/router';
import {AuctionsComponent} from './auctions.component';
import {AuctionsShowComponent} from './auctions-show/auctions-show.component';

const routes: Routes = [
  {path: 'auctions/detail/:id', component: AuctionsShowComponent},
  {path: 'auctions', component: AuctionsComponent},
];

export const routing = RouterModule.forChild(routes);
