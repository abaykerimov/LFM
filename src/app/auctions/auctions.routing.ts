import {RouterModule, Routes} from '@angular/router';
import {AuctionsComponent} from './auctions.component';
import {AuctionsShowComponent} from './auctions-show/auctions-show.component';
import {AuctionsPlayerCostCalculateComponent} from "./auctions-player-cost-calculate/auctions-player-cost-calculate";

const routes: Routes = [
  {path: 'auctions/detail/:id', component: AuctionsShowComponent},
  {path: 'auctions', component: AuctionsComponent},
  // {path: 'auctions/cost', component: AuctionsPlayerCostCalculateComponent}
];

export const routing = RouterModule.forChild(routes);
