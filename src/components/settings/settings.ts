import { Component, OnInit } from '@angular/core';
import { CTask, CUser, CUrgency, CStatus, CCategory, CService } from '../../app/classes';

import { LoadingController, Loading, ViewController, NavParams } from 'ionic-angular';

import { GetDataService } from '../../app/service/getData.service';


@Component({
  
  selector: 'settings',
  templateUrl: 'settings.html',
  
})

export class SettingsComponent implements OnInit {

  textServ: string;
  textCateg: string;
  myParams: boolean;
  datas: Array<any> = new Array;

  private service: Array<CService> = [];
  private serviceCat: Array<CCategory> = [] ;
 
  private debug: boolean = false;
  private debugText: string = undefined;

  private loader: Loading;
  id: string = "000000007";
  CatId: string = "000000005";

  Keys: number =  0;
  
 

  
  
  constructor(private data: GetDataService, public loadingCtrl: LoadingController) {

   
 
  }


  set debugMode(on:boolean){
    this.debug = on;
    this.data.debugMode = on;
    this.Service(); 
  }

  get debugMode() { return this.debug; }

  ngOnInit() {
    this.Service();

  }

  doRefresh(refresher?: any) {

    this.Category(refresher); 
    this.Service(refresher);  
     
    refresher.complete();


    
  }

  Service(refresher?: any) {
    if (undefined === refresher) {
      this.loader = this.loadingCtrl.create({
        content: "Пожалуйста подождите пока данные подгружаются...",
      });
      if (!this.debugMode) this.loader.present();
    }

    this.data.Service((this.debugMode)? this : undefined)
      .subscribe(
        result => {
          this.service = result;

          this.serviceCat[0] = this.service[this.Keys].category;

          if (undefined === refresher) { this.loader.dismiss(); } else { refresher.complete(); }
        },         
        error => {
          debugger;
          console.log("Router(error => ...)", error);
          if (undefined === refresher) { this.loader.dismiss(); } else { refresher.complete(); }
        }
      );      
  }

  Category(refresher?: any){
    if (this.Keys == 18) { 
      this.CatId = this.service[17].category[0].id;
      this.id = this.service[17].id;
      this.serviceCat[0] = this.service[17].category;}

    if (this.Keys == 19) { 
      this.CatId = this.service[18].category[0].id;
      this.id = this.service[17].id;
      this.serviceCat[0] = this.service[18].category;}

    if (this.Keys <= 16) {
     this.CatId = this.service[this.Keys].category[0].id;
     this.id = this.service[this.Keys].id
     this.serviceCat[0] = this.service[this.Keys].category;
    }  

  }

}

