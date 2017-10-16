import { BrowserModule }                                          from '@angular/platform-browser';
import { ErrorHandler, NgModule }                                 from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule }               from 'ionic-angular';
import { IonicStorageModule }                                     from '@ionic/storage';

import { KNGKEngineer }                                           from './app.component';

import { LoginComponent }                                         from '../components/login/login';
import { HomeComponent }                                          from '../components/home/home';
import { ListTaskComponent }                                      from '../components/listTask/listTask';
import { CreateTaskComponent }                                    from '../components/createTask/createTask';
import { MyListTaskComponent }                                    from '../components/myListTask/myListTask';
import { SearchComponent }                                        from '../components/search/search';
import { EditTaskComponent }                                      from '../components/editTask/editTask';
import { SettingsComponent }                                      from '../components/settings/settings';


import { CTask, CUser, CUrgency, CStatus, CCategory, CService }   from './classes';

import { StatusBar }                                              from '@ionic-native/status-bar';
import { SplashScreen }                                           from '@ionic-native/splash-screen';

import { HttpModule }                                             from '@angular/http';
import { AuthenticatedSoapService, AUTHENTICATED_SOAP_SERVICE }   from './service/authenticatedSoap.service';
import { GetDataService }                                         from './service/getData.service';

import { TextEditorComponent }                                    from '../components/textEditor/textEditor';






@NgModule({
  declarations: [
    KNGKEngineer,
    HomeComponent,
    ListTaskComponent,
    LoginComponent,
    CreateTaskComponent,
    MyListTaskComponent,
    SearchComponent,
    EditTaskComponent,
    SettingsComponent,
    TextEditorComponent,
    

    
  ],
  imports: [
    BrowserModule,
    HttpModule,  
    IonicModule.forRoot(KNGKEngineer),
    IonicStorageModule.forRoot(),
    
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    KNGKEngineer,
    HomeComponent,
    ListTaskComponent,
    LoginComponent,
    CreateTaskComponent,
    MyListTaskComponent,
    SearchComponent,
    EditTaskComponent,
    SettingsComponent,
    
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AuthenticatedSoapService,
    AUTHENTICATED_SOAP_SERVICE,
    GetDataService,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
  ]
})
export class AppModule {};
