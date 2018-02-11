import {RouterModule, Routes} from '@angular/router';
import {TeamComponent} from './team.component';
// import {AuctionsShowComponent} from './auctions-show/auctions-show.component';
// import {AuctionsCalculatorComponent} from "./auctions-calculator/auctions-calculator.component";

const routes: Routes = [
  // {path: 'auctions/detail/:id', component: AuctionsShowComponent},
  {path: 'team', component: TeamComponent},
  // {path: 'auctions/calculator', component: AuctionsCalculatorComponent},
];

export const routing = RouterModule.forChild(routes);
