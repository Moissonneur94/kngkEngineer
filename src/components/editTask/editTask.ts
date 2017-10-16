import { Component, OnInit } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { LoadingController, Loading, NavParams, NavController } from 'ionic-angular';

import { GetDataService } from '../../app/service/getData.service';

import { CTask, CUser, CUrgency, CStatus, CCategory, CService, CCancelTask } from '../../app/classes';
import { FormControl, FormBuilder, FormGroup } from "@angular/forms";



/**
 * Generated class for the EditingComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'editTask',
  templateUrl: 'editTask.html'
})
export class EditTaskComponent  implements OnInit {

  public nomer: string = '';
  public typeOfReq: string = '';
  private cancelTask: Array<CCancelTask>
  private taskD: Array<CTask> = [];
 

  private debug: boolean = false;
  private debugText: string = undefined;

  private loader: Loading;

  /*
  * Логические переменные	
  */
  edClick: boolean;              //для редактирования заявки
  eRadioOpen: boolean;
  eRadioResult;
    //тип заявки. Все или Мои

  item: FormControl;

  ComBody: string = "";
  executor: string = "";
  
  DFile: string = "";
  NFile: string = "";

  Attaches: Array<any> = new Array;



  constructor(private data: GetDataService, public loadingCtrl: LoadingController, public alerCtrl: AlertController, public navParams: NavParams, private formBuilder: FormBuilder, public navCtrl: NavController) {

      this.nomer = navParams.get('nomer');
      this.typeOfReq = navParams.get('typeOfReq');

    
      console.log(this.nomer)
      console.log(this.typeOfReq)
 
  }


  ionViewWillLoad() {
    this.item = this.formBuilder.control('');
  }

  set debugMode(on:boolean){
    this.debug = on;
    this.data.debugMode = on;
    this.getTaskDescription();
  }

  get debugMode() { return this.debug; }

  ngOnInit() {
    this.getTaskDescription();
  }

  doRefresh(refresher?: any) {
    this.getTaskDescription(refresher);

    refresher.complete();
  }

  getTaskDescription(refresher?: any){
    if (undefined === refresher) {
      this.loader = this.loadingCtrl.create({
        content: "Пожалуйста подождите пока данные подгружаются...",
      });
      if (!this.debugMode) this.loader.present();
    }

    this.data.GetTaskDescription(this.nomer, this.typeOfReq, (this.debugMode)? this : undefined)
      .subscribe(
        result => {
          this.taskD = result;
          if (undefined === refresher) { this.loader.dismiss(); } else { refresher.complete(); }
        },
        error => {
          debugger;
          console.log("GetTaskDescription(error => ...)", error);
          if (undefined === refresher) { this.loader.dismiss(); } else { refresher.complete(); }
        }
      );    
  }



  //кнопка редактировать
  EditTask() {

  	if (this.edClick==true) {
  		this.edClick=false;
  	}
  	else {
  		this.edClick=true;
  	}


  }


  //Взять в работу
  Appoint() {

  }

  TakeToWork() {

  }

  // Добавить комментарий
  AddComment(event, text, refresher?: any) {


    this.ComBody =  text;
    console.log(this.ComBody);

    this.Attaches.push();

    this.data.EditTask(this.nomer, this.typeOfReq, this.ComBody, this.Attaches, (this.debugMode)? this : undefined)
      .subscribe(
        result => {
          this.taskD = result;
           if (undefined === refresher) { this.loader.dismiss(); } else { refresher.complete(); }
        },
        error => {
          debugger;
          console.log("GetTaskDescription(error => ...)", error);
           if (undefined === refresher) { this.loader.dismiss(); } else { refresher.complete(); }
        }
      ); 

 
  	
  }

  //изменение статуса заявки
  ChangeStat(refresher?: any) {

  	// let alert=this.alerCtrl.create();
  	// alert.setTitle('Статус заявки');

  	// alert.addInput({
  	// 	type: 'radio',
  	// 	label: 'В работе',
  	// 	value: 'В работе',
  	// 	checked: true
  	// });

  	// alert.addInput({
  	// 	type: 'radio',
  	// 	label: 'Выполнена',
  	// 	value: 'Выполнена'
  	// });

  	// alert.addButton('Отмена');

  	// alert.addButton({
   //    text: 'Принять',
   //    handler: data => {
   //      console.log('Radio data:', data);
   //      this.eRadioOpen = false;
       
   //    }
   //  });

   //  alert.present().then(() => {
   //    this.eRadioOpen = true;
   //  });

   if (undefined === refresher) {
      this.loader = this.loadingCtrl.create({
        content: "Пожалуйста подождите пока данные подгружаются...",
      });
      if (!this.debugMode) this.loader.present();
    }

    this.data.CancelTask(this.nomer, this.typeOfReq, (this.debugMode)? this : undefined)
      .subscribe(
        result => {
          this.cancelTask = result;
          if (undefined === refresher) { this.loader.dismiss(); } else { refresher.complete(); }
        },
        error => {
          debugger;
          console.log("GetTaskDescription(error => ...)", error);
          if (undefined === refresher) { this.loader.dismiss(); } else { refresher.complete(); }
        }
      );    

      this.navCtrl.pop();
  }
}
