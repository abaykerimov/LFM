/**
 * Created by Rodion on 20.07.2017.
 */
import {
  Component, OnInit, ViewContainerRef
} from '@angular/core';
import {AuctionsService} from '../shared/auctions.service';
import {NgForm} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import * as moment from 'moment';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';

@Component({
  selector: 'auctions-show',
  templateUrl: './auctions-show.component.html',
  // styleUrls: ['./webinars-edit.component.css']
})

export class AuctionsShowComponent implements OnInit {
  protected moment = moment;
  private sub: any;

  protected configs = {
    editor: {
      uiColor: '#f2f8f7'
    },
    dateTime: {
      format: 'YYYY-MM-DD HH:mm:ss'
    },
    time: {
      format: 'HH:mm'
    }
  };

  protected webinar = {
    all: [],
    lawyers: [],
    duration: '',
    started_at: ''
  };

  protected training = {
    all: [],
    active: [],
    item: 0

  };

  protected classes = {
    all: [],
    active: [],
    inArray: []
  };

  // private searchTerms = new Subject<string>();

  constructor(private aucService: AuctionsService, private route: ActivatedRoute, private vcr: ViewContainerRef) {
    this.aucService.toastr.setRootViewContainerRef(this.vcr);
  }

  ngOnInit() {
    this.showWebinar();
    // this.searchClass();
  }

  // protected searchClass() {
  //   this.searchTerms
  //     .debounceTime(1000)
  //     .switchMap(term => term
  //       ? this.webService.getClasses(term)
  //       : Observable.of<any[]>([]))
  //     .catch(error => {
  //       return Observable.of<any[]>([]);
  //     }).subscribe((data) => {
  //     let arr = [];
  //     if (data.length > 0){
  //       data.forEach((item) => {
  //         arr.push({id: item.id, text: `<a class="select-items" href='/webinars/${item.id}/edit'><i class="fa fa-link"></i></a> ${item.title}`});
  //       });
  //     }
  //     this.classes.all = arr;
  //     console.log(this.classes.all);
  //   });
  //   this.classSearch(" ");
  // }

  protected showWebinar() {
    this.sub = this.route.params.subscribe(
      params => {
        let id = params['id'];
        this.aucService.showAuction(id).subscribe(
          (data) => {
            this.webinar.all = data;
            console.log(this.webinar.all);
            if (data['type'] === 'Обучение') {
              this.setActiveClasses(data['classes']);
            } else {
              this.training.item = data['course_id'];
              this.training.active.push({id: data['course'].id, text: `<a class="select-items" href='/webinars/${data['course'].id}/edit'><i class="fa fa-link"></i></a> ${data['course'].title}`});
            }
            if(data.length > 0 && this.webinar.lawyers.length > 0) {
              this.aucService.flash('Данные успешно загружены', 'success');
            }
          });
      }
    );
  }
  //
  // protected getTrainings() {
  //   this.aucService.getTrainings().subscribe(
  //     (data) => {
  //       data.forEach(item => {
  //         item.text = `<a class="select-items" href='/webinars/${item.id}/edit'><i class="fa fa-link"></i></a> ${item.text}`;
  //       });
  //       this.training.all = data;
  //     }
  //   );
  // }

  // protected classSearch(value:any = ""){
  //   this.searchTerms.next(value);
  // }
  //
  // protected update(form: NgForm) {
  //   form.value.type = this.webinar.all['type'];
  //   if (this.webinar.all['type'] === 'Обучение') {
  //     this.updateTraining(form.value);
  //   } else {
  //     this.updateClass(form.value);
  //   }
  //   console.log(form.value);
  //   this.webService.updateWebinar(form.value,this.webinar.all).subscribe(
  //     () => {this.webService.flash(this.webinar.all['type'] +' успешно отредактировано', 'success');},
  //     () => {this.webService.flash('Произошла ошибка', 'danger');});
  // }
  //
  // private updateTraining(data: any) {
  //   data.classes = this.classes.inArray;
  //
  // }
  //
  // private updateClass(data: any) {
  //   if (this.webinar.duration !== '') {
  //     data.duration = this.webinar.duration;
  //   }
  //   if (this.webinar.started_at !== '') {
  //     data.started_at = this.webinar.started_at
  //   }
  //   if (this.training.item !== 0) {
  //     data.course_id = this.training.item;
  //   }
  // }
  //
  // protected deleteClass(event: any) {
  //   this.webService.deleteClass(event).subscribe();
  //   this.webService.flash('Занятие удалено из обучения', 'success');
  // }
  //
  // protected onDurationChange(event) {
  //   this.webinar.duration = moment(event).format('HH:mm');
  // }
  //
  // protected onStartChange(event) {
  //   this.webinar.started_at = moment(event).format('YYYY-MM-DD HH:mm:ss');
  // }
  //
  // protected onFileChange(event) {
  //   this.webService.uploadFile(event);
  // }
  //
  // protected setClassesArray(event, type) {
  //   if (type === 'add') {
  //     this.classes.inArray.push(event.id);
  //   } else {
  //     let index = this.classes.inArray.indexOf(event.id);
  //     this.classes.inArray.splice(index, 1);
  //     this.deleteClass(event);
  //   }
  // }

  protected setActiveClasses(data:any) {
    let arr = [];
    data.forEach((item) => {
      arr.push({id: item.id, text: `<a class="select-items" href='/webinars/${item.id}/edit'><i class="fa fa-link"></i></a> ${item.title}`});
      this.classes.inArray.push(item.id);
    });
    this.classes.active = arr;
  }
  //
  // protected setTrainingItem(event) {
  //   this.training.item = event.id;
  // }
}
