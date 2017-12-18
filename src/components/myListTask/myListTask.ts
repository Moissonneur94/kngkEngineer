import { Component, OnInit } from '@angular/core';
import {
  LoadingController,
  Loading,
  NavController,
  NavParams,
  Events
} from "ionic-angular";

import { GetDataService } from "../../app/service/getData.service";

import { EditTaskComponent } from "../editTask/editTask";
import {
  CTask,
  CUser,
  CUrgency,
  CStatus,
  CCategory,
  CService, 
  CCancelTask 
} from "../../app/classes";

@Component({
  selector: "myListTask",
  templateUrl: "myListTask.html"
})
export class MyListTaskComponent implements OnInit {
  public tasks: Array<CTask> = [];
  public inWork: boolean = true;
  private cancelTask: Array<CCancelTask>;

  private loader: Loading;
  

  constructor(
    public events: Events,
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    private data: GetDataService
  ) {}

  public ngOnInit() {
    this.getTask();
  }

  public doRefresh(refresher?: any) {
    this.getTask(refresher);
  }

  public getTask(refresher?: any) {
    if (undefined === refresher) {
      this.loader = this.loadingCtrl.create({
        content: "Пожалуйста подождите пока данные подгружаются..."
      });
      this.loader.present();
    }

    this.data.GetTask(true, this.inWork, false).subscribe(
      result => {
        this.tasks = result;
        if (undefined === refresher) {
          this.loader.dismiss();
        } else {
          refresher.complete();
        }
      },
      error => {
        debugger;
        console.log("GetTask(error => ...)", error);
        if (undefined === refresher) {
          this.loader.dismiss();
        } else {
          refresher.complete();
        }
      }

     
    );
  }

  public itemTapped($event, id, req, status) {
    this.navCtrl.push(EditTaskComponent, {
      nomer: id,
      typeOfReq: req,
      stats: status,
      myPages: "MyListTaskComponent"
    });
  }

  public ChangeStat($event, id, req) {
    
    // this.data.CancelTask(id, req).subscribe(
    //   result => {
    //     this.cancelTask = result;
    //   },
    //   error => {
    //     debugger;
    //     console.log("CancelTask(error => ...)", error);
    //   }
    // );
  }
}
