import { Component, OnInit } from "@angular/core";
import {
  AlertController,
  Events,
  LoadingController,
  Loading,
  NavParams,
  NavController
} from "ionic-angular";

import { GetDataService } from "../../app/service/getData.service";

import { CTask, CCancelTask } from "../../app/classes";
import { FormControl, FormBuilder } from "@angular/forms";
import { MyListTaskComponent } from "../myListTask/myListTask";
import { ListTaskComponent } from "../listTask/listTask";

@Component({
  selector: "editTask",
  templateUrl: "editTask.html"
})
export class EditTaskComponent implements OnInit {
  public nomer: string = "";
  public typeOfReq: string = "";
  public stats: string = "";
  public myPage: string = "";
  public statusTask: string = "Завершен";
  public statExec: string = "Зарегистрирован";


  public type: string;

  public base64: string;
  public base: string;
  public numI: number;
  public datas: string;

  private cancelTask: Array<CCancelTask>;
  public taskD: Array<CTask> = [];

  private loader: Loading;

  /*
  * Логические переменные
  */
  public edClick: boolean = false; // для редактирования заявки
  // тип заявки. Все или Мои

  public item: FormControl;

  public ComBody: string = "";
  public executor: string = "";

  public DFile: string = "";
  public NFile: string = "";

  public Attaches: Array<any> = new Array();

  constructor(
    public events: Events,
    private data: GetDataService,
    public loadingCtrl: LoadingController,
    public alerCtrl: AlertController,
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    public navCtrl: NavController
  ) {
    this.nomer = navParams.get("nomer");
    this.typeOfReq = navParams.get("typeOfReq");
    this.stats = navParams.get("stats");
    this.myPage = navParams.get("myPages");



    // console.log(this.nomer);
    // console.log(this.typeOfReq);
  }




  public ionViewWillLoad() {
    this.item = this.formBuilder.control("");
  }

  public ngOnInit() {
    this.getTaskDescription();
  }

  public doRefresh(refresher?: any) {
    this.getTaskDescription(refresher);

    refresher.complete();
  }

  public getTaskDescription(refresher?: any) {
    if (undefined === refresher) {
      this.loader = this.loadingCtrl.create({
        content: "Пожалуйста подождите пока данные подгружаются..."
      });
      this.loader.present();
    }

    this.data.GetTaskDescription(this.nomer, this.typeOfReq).subscribe(
      result => {
        this.taskD = result;
        if (undefined === refresher) {
          this.loader.dismiss();
        } else {
          refresher.complete();
        }
      },
      error => {
        debugger;
        console.log("GetTaskDescription(error => ...)", error);
        if (undefined === refresher) {
          this.loader.dismiss();
        } else {
          refresher.complete();
        }
      }
    );
  }

  // кнопка редактировать
  public EditTask() {
    this.edClick = this.edClick === true ? false : true;
  }

  // Взять в работу
  public Appoint() {}

  public TakeToWork() {}

  // Добавить комментарий
  public AddComment(event, text, refresher?: any) {
    this.ComBody = text;
    console.log(this.ComBody);

    this.Attaches.push();

    this.data
      .EditTask(this.nomer, this.typeOfReq, this.ComBody, this.Attaches)
      .subscribe(
        result => {
          this.taskD = result;
          if (undefined === refresher) {
            this.loader.dismiss();
          } else {
            refresher.complete();
          }
        },
        error => {
          debugger;
          console.log("EditTask(error => ...)", error);
          if (undefined === refresher) {
            this.loader.dismiss();
          } else {
            refresher.complete();
          }
        }
      );

    this.edClick = false;
  }

  // изменение статуса заявки
  public ChangeStat(refresher?: any) {
    if (undefined === refresher) {
      this.loader = this.loadingCtrl.create({
        content: "Пожалуйста подождите пока данные подгружаются..."
      });
      this.loader.present();
    }

    this.data.CancelTask(this.nomer, this.typeOfReq).subscribe(
      result => {
        this.cancelTask = result;
        if (undefined === refresher) {
          this.loader.dismiss();
        } else {
          refresher.complete();
        }
      },
      error => {
        debugger;
        console.log("CancelTask(error => ...)", error);
        if (undefined === refresher) {
          this.loader.dismiss();
        } else {
          refresher.complete();
        }
      }
    );

    if (this.myPage === "ListTaskComponent") {
      this.navCtrl.setRoot(ListTaskComponent, null, null);
    } else if (this.myPage === "MyListTaskComponent") {
      this.navCtrl.setRoot(MyListTaskComponent, null, null);
    }
  }
}
