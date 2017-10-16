import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LoadingController, Loading } from 'ionic-angular';

import { Injectable } from '@angular/core';

import { GetDataService } from '../../app/service/getData.service';

import { EditTaskComponent } from '../editTask/editTask';
import { CTask, CUser, CUrgency, CStatus, CCategory, CService } from '../../app/classes';

@Component({
  selector: 'myListTask',
  templateUrl: 'myListTask.html', 
})
export class MyListTaskComponent implements OnInit {

  private tasks: Array<CTask> = [];
  private inWork: boolean = true;

  private debug: boolean = false;
  private debugText: string = undefined;

  private loader: Loading;


  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController, private data: GetDataService) {}

  set debugMode(on: boolean) {
    this.debug = on;
    this.data.debugMode = on;
    this.getTask();
  }
  get debugMode() { return this.debug; }




  ngOnInit() {
    this.getTask();
  }

  doRefresh(refresher?: any) {
    this.getTask(refresher);
  }

  getTask(refresher?: any) {
    if (undefined === refresher) {
      this.loader = this.loadingCtrl.create({
        content: "Пожалуйста подождите пока данные подгружаются...",
      });
      if (!this.debugMode) this.loader.present();
    }

    this.data.GetTask(true, this.inWork, (this.debugMode)? this : undefined)
      .subscribe(
        result => {
          this.tasks = result;
          if (undefined === refresher) { this.loader.dismiss(); } else { refresher.complete(); }
        },
        error => {
          debugger;
          console.log("GetTask(error => ...)", error);
          if (undefined === refresher) { this.loader.dismiss(); } else { refresher.complete(); }
        }
      );
  }

  itemTapped($event, id, req) {

    this.navCtrl.push(EditTaskComponent, {nomer: id, typeOfReq: req});
  }

}
