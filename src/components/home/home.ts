import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';

import { ListTaskComponent } from '../listTask/listTask';
import { MyListTaskComponent } from '../myListTask/myListTask';
import { SearchComponent } from '../search/search';
import { CreateTaskComponent } from '../createTask/createTask';

import { SettingsComponent } from '../settings/settings';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomeComponent {

  pages: Array<{title: string, component: any}>;

  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController) {
    this.pages = [
      { title: 'Все заявки', component: ListTaskComponent },
      { title: 'Заявки выполняемые мною', component: MyListTaskComponent },
      // { title: 'Поиск заявки', component: SearchComponent },
      // { title: 'Настройки', component: SettingsComponent },
      { title: 'Создать заявку', component: CreateTaskComponent },

    ];
  }

  openPage(page) {
    let loader = this.loadingCtrl.create({
      content: "Пожалуйста подождите...",
    });
    loader.present();
    this.navCtrl.setRoot(page.component, null, null, () => { loader.dismiss() });
  }

}
