import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AlertController, LoadingController, Loading } from 'ionic-angular';

import { HomeComponent } from '../home/home';
import { FormControl, FormBuilder, FormGroup } from "@angular/forms";

import { GetDataService } from '../../app/service/getData.service';
import { CTask, CUser, CUrgency, CStatus, CCategory, CService, COption } from '../../app/classes';


/**
 * Generated class for the CreoComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'createTask',
  templateUrl: 'createTask.html'
})
export class CreateTaskComponent /*implements OnInit*/ {
 
  subjectTask: string = ""; //текст заявки
  body: string = "";
  
  pages: Array<{title: string, component: any}>;
  error: boolean = false;
  item: FormControl;
  
  private tasks:  Array<CTask> = [];
  private debug: boolean = true;
  private debugText: string = undefined;

  private loader: Loading;

  private service: Array<CService> = [];
  private serviceCat: Array<CCategory> = []; 
  private newTask: Array<any> = [];
  Attaches: Array<any> = new Array;
  id: string = "000000007";
  CatId: string = "000000005";
  Keys: number =  0;
  typeCat: string = "";

  constructor(public navCtrl: NavController, public alerCtrl: AlertController, private formBuilder: FormBuilder, private data: GetDataService, public loadingCtrl: LoadingController) {}
    /*this.backgroundMode.enable();*/

    // set debugMode(on: boolean) {
    //   this.debug = on;
    //   this.data.debugMode = on;
    //   this.NewTask();
    // }

    // get debugMode() { return this.debug; }

  //   ngOnInit() { 
  //     this.NewTask();
  //   }
   

      
 

  ionViewWillLoad() {
    this.item = this.formBuilder.control('');
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
      this.typeCat = this.service[17].category[0].typeCategory;
      this.id = this.service[17].id;
      this.serviceCat[0] = this.service[17].category;}

    if (this.Keys == 19) { 
      this.CatId = this.service[18].category[0].id;
      this.typeCat = this.service[18].category[0].typeCategory;
      this.id = this.service[17].id;
      this.serviceCat[0] = this.service[18].category;}

    if (this.Keys <= 16) {
     this.CatId = this.service[this.Keys].category[0].id;
     this.typeCat = this.service[this.Keys].category[0].typeCategory;
     this.id = this.service[this.Keys].id
     this.serviceCat[0] = this.service[this.Keys].category;
    }  

  }

  //создание заявки
  CreateTask(event, body, subject, refresher?: any) {

    //проверка на заполненые поля

    // if(this.subjectTask==null || this.subjectTask=="") {

    //   this.errorField();
    // } 
    //   else if(!this.error) {

    //   this.errorAlert();
    // }
    //   else {
    //     this.completeAlert();
    // }

  
    //Данные заявки
    if (undefined === refresher) {
      this.loader = this.loadingCtrl.create({
        content: "Пожалуйста подождите пока данные подгружаются...",
      });
      if (!this.debugMode) this.loader.present();
    }

    this.data.NewTask( this.body = body, this.subjectTask = subject, this.id, this.CatId,  this.typeCat, this.Attaches, (this.debugMode)? this : undefined)
      .subscribe(
        result => {
          this.newTask = result;

          if (undefined === refresher) { this.loader.dismiss(); } else { refresher.complete(); }
        },         
        error => {
          debugger;
          console.log("Router(error => ...)", error);
          if (undefined === refresher) { this.loader.dismiss(); } else { refresher.complete(); }
        }
      );            

    /*
    * ТУТ ДОЛЖНЫ БЫТЬ ИНСТРУКИИ
    */
    this.completeAlert();
   
    this.CloseOrder();

  }

  CloseOrder() {  
    
    this.navCtrl.setRoot(HomeComponent);
  }


  //Оповещения для пользователя
  completeAlert(){

    let alert = this.alerCtrl.create({
      title: 'Заявка принята',
      message: 'Спасибо за вашу заявку, ожидайте результатов выполнения!',
      buttons: ['Закрыть']
    });

    alert.present()
  }

  errorAlert(){

    let alert = this.alerCtrl.create({
      title: 'Ошибка',
      message: 'Произошла ошибка, пожалуйста повторите отправку заявки',
      buttons: ['Закрыть']
    });

    alert.present()
  }

  errorField(){

    let alert = this.alerCtrl.create({
      title: 'Пустые поля',
      message: 'Есть пустые поля, пожалуйста заполните все поля и повторите отправку заявки',
      buttons: ['Закрыть']
    });

    alert.present()
  }

}

