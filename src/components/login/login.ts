import { Component } from '@angular/core';
import { LoadingController } from 'ionic-angular';
import { NavController } from 'ionic-angular';
import { HomeComponent } from '../home/home';
import { GetDataService } from '../../app/service/getData.service';

import { Storage } from '@ionic/storage';
import { NativeStorage } from '@ionic-native/native-storage';

@Component({
  selector: 'login',
  templateUrl: 'login.html',
})
export class LoginComponent {
  
  private user: string = "";
  private password: string = "";

  private errorHeader: string = null;
  private errorText: string = null;

  private debug: boolean = false;
  private debugText: string = null;
  private saveUser: boolean;


  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController, private data: GetDataService, private storage: Storage) {
    data.clearAuth();
    this.GetData();
      
    
  }


  envelopeBuilder(requestBody:string): string {
    return '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:main="MainInfoService">' +
           ' <soapenv:Header/>'  +
           ' <soapenv:Body>'     +
           '   <main:GetUser>'   +
                 requestBody     +
           '   </main:GetUser>'  +
           ' </soapenv:Body>'    +
           '</soapenv:Envelope>';
  }

  set debugMode(on: boolean) {
    this.debug = on;
    this.data.debugMode = on;
  }
  get debugMode() { return this.debug; }

  userLogin() {
    // this.storage.set('user', 'true')
    
    this.errorHeader = '';
    this.errorText = '';
    this.debugText = '';

    let loader = this.loadingCtrl.create({
      content: "Пожалуйста подождите пока выполняется вход...",
    });
    if (!this.debugMode) loader.present();

    this.data.setAuthData(this.user, this.password, (this.debugMode)? this : undefined);

    this.data.GetUser(this.user, (this.debugMode) ? this : undefined )
      .subscribe(
        user => {
          if (this.debugMode) {
            debugger;
            console.log('Result (userLogin): ', user);
            this.debugText += "GetUser(user => " + user.fio + ") ";
          } else {
            this.navCtrl.setRoot(HomeComponent, null, null, () => { loader.dismiss() });
          }
        },
        error => {
          if (this.debugMode) {
            debugger;
            console.log("GetUser(error => ..)", error);
            this.debugText += "GetUser(error => " + error.faultstring + ") ";
          }
          loader.dismiss();
          this.errorHeader = error["faultheader"];
          this.errorText = error["faultstring"];
        }
      );
      
      if(this.saveUser == true){
        this.SetData();
      }
       else { 
         this.setData();
       }
  }



  SetData(){
    this.storage.set("user", this.user);
    this.storage.set("password", this.password);
    this.storage.set("saveU", this.saveUser);
   
    
  }

  setData(){
    this.storage.set("saveU", this.saveUser);
    this.storage.set("user", "");
    this.storage.set("password", "");
  }

   GetData(){
     this.storage.get("user").then((udata) => {
      this.user = udata;

      // console.log(udata)
    })
     this.storage.get("saveU").then((sdata) => {
       this.saveUser = sdata;
       // console.log(sdata)
     })
     this.storage.get("password").then((pdata) => {
       this.password = pdata;
       // console.log(pdata)
     })
   }
}