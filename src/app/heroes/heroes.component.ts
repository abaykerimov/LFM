import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

import {Hero} from './shared/hero';
import {HeroService} from './shared/hero.service';
import {Md5} from 'ts-md5/dist/md5';

@Component({
  selector: 'heroes',
  templateUrl: './heroes.component.html',
  // styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements OnInit {
  heroes: Hero[];
  selectedHero: Hero;

  constructor(private heroService: HeroService,
              private router: Router) {
    console.log(Md5.hashStr('6195603_146807370_yrqoSBU4JX8ZXY2jsiHg'));
  }

  getHeroes(): void {
    this.heroService
      .getHeroes()
      .then(heroes => this.heroes = heroes);
  }

  add(name: string): void {
    name = name.trim();
    if (!name) {
      return;
    }
    this.heroService.create(name)
      .then(hero => {
        this.heroes.push(hero);
        this.selectedHero = null;
      });
  }

  delete(hero: Hero): void {
    this.heroService
      .delete(hero.id)
      .then(() => {
        this.heroes = this.heroes.filter(h => h !== hero);
        if (this.selectedHero === hero) {
          this.selectedHero = null;
        }
      });
  }

  ngOnInit(): void {
    this.getHeroes();
  }

  onSelect(hero: Hero): void {
    this.selectedHero = hero;
  }

  gotoDetail(): void {
    this.router.navigate(['detail', this.selectedHero.id]);
  }
}
