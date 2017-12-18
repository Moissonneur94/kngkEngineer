import { Component, OnInit } from "@angular/core";
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
  CService
} from "../../app/classes";

@Component({
  selector: "page-list",
  templateUrl: "listTask.html"
})
export class ListTaskComponent implements OnInit {
  public tasks: Array<CTask> = [];
  public inWork: boolean = true;

  private loader: Loading;

  // public nomer: string;
  // public typeOfReq: string;
  // public stats: string;

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

    this.data.GetTask(false, this.inWork, true).subscribe(
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

  public itemTapped(event, id, req, status) {
    this.navCtrl.push(EditTaskComponent, {
      nomer: id,
      typeOfReq: req,
      stats: status,
      myPages: "ListTaskComponent"
    });
  }

  public ChangeStat(refresher?: any) {
    // if (undefined === refresher) {
    //   this.loader = this.loadingCtrl.create({
    //     content: "Пожалуйста подождите пока данные подгружаются..."
    //   });
    //   this.loader.present();
    // }

    // this.data.CancelTask(this.nomer, this.typeOfReq).subscribe(
    //   result => {
    //     this.cancelTask = result;
    //     if (undefined === refresher) {
    //       this.loader.dismiss();
    //     } else {
    //       refresher.complete();
    //     }
    //   },
    //   error => {
    //     debugger;
    //     console.log("CancelTask(error => ...)", error);
    //     if (undefined === refresher) {
    //       this.loader.dismiss();
    //     } else {
    //       refresher.complete();
    //     }
    //   }
    // );
  }
}
