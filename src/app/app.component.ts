import { Component, ViewChild } from "@angular/core";
import { Nav, Platform } from "ionic-angular";
import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";

import { HomeComponent } from "../components/home/home";
import { ListTaskComponent } from "../components/listTask/listTask";
import { LoginComponent } from "../components/login/login";
import { CreateTaskComponent } from "../components/createTask/createTask";
import { MyListTaskComponent } from "../components/myListTask/myListTask";

// import { SearchComponent } from '../components/search/search';
// import { SettingsComponent } from '../components/settings/settings';
// import { HelpComponent } from '../components/help/help';

@Component({
  templateUrl: "app.html"
})
export class KNGKEngineer {
  @ViewChild(Nav) public nav: Nav;

  public rootPage: any = HomeComponent;

  public pages: Array<{ title: string; component: any }>;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen
  ) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: "Домашняя страница", component: HomeComponent },
      { title: "Все заявки", component: ListTaskComponent },
      { title: "Заявки выполняемые мною", component: MyListTaskComponent },
      // { title: 'Поиск заявки', component: SearchComponent },
      { title: "Создать заявку", component: CreateTaskComponent },
      // { title: 'Настройки', component: SettingsComponent },
      // { title: 'Справка', component: HelpComponent },

      { title: "Выход", component: LoginComponent }
    ];
  }

  public initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  public openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
