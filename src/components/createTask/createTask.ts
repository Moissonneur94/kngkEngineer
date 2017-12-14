import { Component } from "@angular/core";
import {
  AlertController,
  LoadingController,
  Loading,
  NavController
} from "ionic-angular";

import { HomeComponent } from "../home/home";
import { FormControl, FormBuilder } from "@angular/forms";

import { GetDataService } from "../../app/service/getData.service";
import { /* CTask, */ CCategory, CService } from "../../app/classes";

@Component({
  selector: "createTask",
  templateUrl: "createTask.html"
})
export class CreateTaskComponent /*implements OnInit*/ {
  public subjectTask: string = ""; // текст заявки
  public body: string = "";

  public pages: Array<{ title: string; component: any }>;
  public error: boolean = false;
  public item: FormControl;

  // private tasks: Array<CTask> = [];
  private newTask: Array<any> = [];

  private loader: Loading;

  public service: Array<CService> = [];
  public serviceCat: Array<CCategory> = [];
  private Attaches: Array<any> = new Array();
  private id: string = "000000007";
  public CatId: string = "000000005";
  public Keys: number = 0;
  private typeCat: string = "";

  constructor(
    public navCtrl: NavController,
    public alerCtrl: AlertController,
    private formBuilder: FormBuilder,
    private data: GetDataService,
    public loadingCtrl: LoadingController
  ) {}

  public ionViewWillLoad() {
    this.item = this.formBuilder.control("");
  }

  public ngOnInit() {
    this.Service();
  }

  public doRefresh(refresher?: any) {
    this.Category(refresher);
    this.Service(refresher);

    refresher.complete();
  }

  public Service(refresher?: any) {
    if (undefined === refresher) {
      this.loader = this.loadingCtrl.create({
        content: "Пожалуйста подождите пока данные подгружаются..."
      });
      this.loader.present();
    }

    this.data.Service().subscribe(
      result => {
        this.service = result;

        this.serviceCat[0] = this.service[this.Keys].category;

        if (undefined === refresher) {
          this.loader.dismiss();
        } else {
          refresher.complete();
        }
      },
      error => {
        debugger;
        console.log("Router(error => ...)", error);
        if (undefined === refresher) {
          this.loader.dismiss();
        } else {
          refresher.complete();
        }
      }
    );
  }

  public Category(refresher?: any) {
    if (this.Keys === 18) {
      this.CatId = this.service[17].category[0].id;
      this.typeCat = this.service[17].category[0].typeCategory;
      this.id = this.service[17].id;
      this.serviceCat[0] = this.service[17].category;
    }

    if (this.Keys === 19) {
      this.CatId = this.service[18].category[0].id;
      this.typeCat = this.service[18].category[0].typeCategory;
      this.id = this.service[17].id;
      this.serviceCat[0] = this.service[18].category;
    }

    if (this.Keys <= 16) {
      this.CatId = this.service[this.Keys].category[0].id;
      this.typeCat = this.service[this.Keys].category[0].typeCategory;
      this.id = this.service[this.Keys].id;
      this.serviceCat[0] = this.service[this.Keys].category;
    }
  }

  // создание заявки
  public CreateTask(event, body, subject, refresher?: any) {
    // проверка на заполненые поля

    // if(this.subjectTask==null || this.subjectTask=="") {

    //   this.errorField();
    // }
    //   else if(!this.error) {

    //   this.errorAlert();
    // }
    //   else {
    //     this.completeAlert();
    // }

    // Данные заявки
    if (undefined === refresher) {
      this.loader = this.loadingCtrl.create({
        content: "Пожалуйста подождите пока данные подгружаются..."
      });
      this.loader.present();
    }

    this.data
      .NewTask(
        (this.body = body),
        (this.subjectTask = subject),
        this.id,
        this.CatId,
        this.typeCat,
        this.Attaches
      )
      .subscribe(
        result => {
          this.newTask = result;

          if (undefined === refresher) {
            this.loader.dismiss();
          } else {
            refresher.complete();
          }
        },
        error => {
          debugger;
          console.log("Router(error => ...)", error);
          if (undefined === refresher) {
            this.loader.dismiss();
          } else {
            refresher.complete();
          }
        }
      );

    /*
    * ТУТ ДОЛЖНЫ БЫТЬ ИНСТРУКИИ
    */
    this.completeAlert();

    this.CloseOrder();
  }

  public CloseOrder() {
    this.navCtrl.setRoot(HomeComponent);
  }

  // Оповещения для пользователя
  public completeAlert() {
    const alert = this.alerCtrl.create({
      title: "Заявка принята",
      message: "Спасибо за вашу заявку, ожидайте результатов выполнения!",
      buttons: ["Закрыть"]
    });

    alert.present();
  }

  public errorAlert() {
    const alert = this.alerCtrl.create({
      title: "Ошибка",
      message: "Произошла ошибка, пожалуйста повторите отправку заявки",
      buttons: ["Закрыть"]
    });

    alert.present();
  }

  public errorField() {
    const alert = this.alerCtrl.create({
      title: "Пустые поля",
      message:
        "Есть пустые поля, пожалуйста заполните все поля и повторите отправку заявки",
      buttons: ["Закрыть"]
    });

    alert.present();
  }
}
