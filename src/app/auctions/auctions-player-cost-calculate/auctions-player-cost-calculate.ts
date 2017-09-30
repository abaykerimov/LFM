import {
  Component, OnInit, ViewChild, ViewContainerRef
} from '@angular/core';
import {AuctionsService} from '../shared/auctions.service';
import {NgForm} from '@angular/forms';
import {Router} from '@angular/router';
import {ModalDirective} from 'ngx-bootstrap';
import * as moment from 'moment';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'auctions-player-cost-calculate',
  templateUrl: './auctions-player-cost-calculate.component.html'
})

export class AuctionsPlayerCostCalculateComponent implements OnInit {

  constructor(protected aucService: AuctionsService, private router: Router, private vcr: ViewContainerRef) {
    this.aucService.toastr.setRootViewContainerRef( this.vcr);
  }

  ngOnInit() {

  }

  // protected calculateCost() {
  //   let result = ((Math.pow(this.player.skill, 4)) / ( ((100 - this.player.skill) / this.player.skill) * (110 - this.player.skill) ));
  //   if (this.player.position === 'CB') {
  //     result *= 2;
  //   }
  //   if (this.player.position === 'RB' || this.player.position === 'LB') {
  //     result *= 2.2;
  //   }
  //   if (this.player.position === 'RWB' || this.player.position === 'LWB') {
  //     result *= 2.4;
  //   }
  //   if (this.player.position === 'CDM') {
  //     result *= 2.5;
  //   }
  //   if (this.player.position === 'CM') {
  //     result *= 2.7;
  //   }
  //   if (this.player.position === 'RM' || this.player.position === 'LM') {
  //     result *= 2.9;
  //   }
  //   if (this.player.position === 'RW' || this.player.position === 'LW') {
  //     result *= 3.2;
  //   }
  //   if (this.player.position === 'CAM') {
  //     result *= 3.3;
  //   }
  //   if (this.player.position === 'ST' || this.player.position === 'CF' || this.player.position === 'LF' || this.player.position === 'RF') {
  //     result *= 3.5;
  //   }
  //   result *= ((35 - this.player.age) * 0.1);
  //   if (result > 120000000) {
  //     result = 120000000;
  //   }
  //
  //   this.player.cost = Math.round(result / 1000000);
  // }
}
