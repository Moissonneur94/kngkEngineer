import { Component } from "@angular/core";
import { LoadingController, NavController } from "ionic-angular";

import { ListTaskComponent } from "../listTask/listTask";
import { MyListTaskComponent } from "../myListTask/myListTask";
// import { SearchComponent } from '../search/search';
import { CreateTaskComponent } from "../createTask/createTask";
import { HelpComponent } from "../help/help";
// import { SettingsComponent } from '../settings/settings';

@Component({
  selector: "page-home",
  templateUrl: "home.html"
})
export class HomeComponent {
  public pages: Array<{ title: string; component: any }>;

  constructor(
    public navCtrl: NavController,
    public loadingCtrl: LoadingController
  ) {
    this.pages = [
      { title: "Все заявки", component: ListTaskComponent },
      { title: "Заявки выполняемые мною", component: MyListTaskComponent },
      { title: "Создать заявку", component: CreateTaskComponent },
      // { title: 'Поиск заявки', component: SearchComponent },
      // { title: 'Настройки', component: SettingsComponent },
      { title: "Справка", component: HelpComponent }
    ];
  }

  public openPage(page) {
    const loader = this.loadingCtrl.create({
      content: "Пожалуйста подождите..."
    });
    loader.present();
    this.navCtrl.setRoot(page.component, null, null, () => {
      loader.dismiss();
    });
  }
}
