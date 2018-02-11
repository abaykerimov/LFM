import {RouterModule, Routes} from '@angular/router';
import {TransfersComponent} from './transfers.component';
// import {AuctionsShowComponent} from './auctions-show/auctions-show.component';
// import {AuctionsCalculatorComponent} from "./auctions-calculator/auctions-calculator.component";

const routes: Routes = [
  // {path: 'auctions/detail/:id', component: AuctionsShowComponent},
  {path: 'transfers', component: TransfersComponent},
  // {path: 'auctions/calculator', component: AuctionsCalculatorComponent},
];

export const routing = RouterModule.forChild(routes);
