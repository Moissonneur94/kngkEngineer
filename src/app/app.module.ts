import { BrowserModule } from "@angular/platform-browser";
import { ErrorHandler, NgModule } from "@angular/core";
import { IonicApp, IonicErrorHandler, IonicModule } from "ionic-angular";
import { IonicStorageModule } from "@ionic/storage";

import { KNGKEngineer } from "./app.component";

import { LoginComponent } from "../components/login/login";
import { HomeComponent } from "../components/home/home";
import { ListTaskComponent } from "../components/listTask/listTask";
import { CreateTaskComponent } from "../components/createTask/createTask";
import { MyListTaskComponent } from "../components/myListTask/myListTask";
// import { SearchComponent } from "../components/search/search";
import { EditTaskComponent } from "../components/editTask/editTask";
// import { SettingsComponent } from "../components/settings/settings";
import { HelpComponent } from "../components/help/help";
import { TextEditorComponent } from "../components/textEditor/textEditor";

// import { CTask, CUser, CUrgency, CStatus, CCategory, CService }   from './classes';

import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";

import {
  HttpHandler,
  HttpClient,
  HttpClientModule,
  HTTP_INTERCEPTORS
} from "@angular/common/http";

import * as CONSTANTS from "./service/constants";
import { AuthenticationInterceptor } from "./service/authenticationInterceptor.service";
import { AuthenticatedSoapService } from "./service/authenticatedSoap.service";
import { GetDataService } from "./service/getData.service";



@NgModule({
  declarations: [
    KNGKEngineer,
    HomeComponent,
    ListTaskComponent,
    LoginComponent,
    CreateTaskComponent,
    MyListTaskComponent,
    // SearchComponent,
    EditTaskComponent,
    // SettingsComponent,
    HelpComponent,
    TextEditorComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(KNGKEngineer),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    KNGKEngineer,
    HomeComponent,
    ListTaskComponent,
    LoginComponent,
    CreateTaskComponent,
    MyListTaskComponent,
    // SearchComponent,
    EditTaskComponent,
    // SettingsComponent,
    HelpComponent
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthenticationInterceptor,
      multi: true
    },
    {
      provide: AuthenticatedSoapService,
      useFactory: (hd: HttpHandler) => {
        return new AuthenticatedSoapService(
          new HttpClient(hd),
          CONSTANTS.MAIN_URL,
          CONSTANTS.MAIN_NAMESPACE
        );
      },
      deps: [HttpHandler]
    },
    GetDataService,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule {}
