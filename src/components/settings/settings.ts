import { Component, OnInit } from "@angular/core";
import { CCategory, CService } from "../../app/classes";
import { LoadingController, Loading } from "ionic-angular";
import { GetDataService } from "../../app/service/getData.service";

@Component({
  selector: "settings",
  templateUrl: "settings.html"
})
export class SettingsComponent implements OnInit {
  public textServ: string;
  public textCateg: string;
  public myParams: boolean;
  public datas: Array<any> = new Array();

  public service: Array<CService> = [];
  public serviceCat: Array<CCategory> = [];

  private loader: Loading;
  public id: string = "000000007";
  public CatId: string = "000000005";

  public Keys: number = 0;

  constructor(
    private data: GetDataService,
    public loadingCtrl: LoadingController
  ) {}

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
      this.id = this.service[17].id;
      this.serviceCat[0] = this.service[17].category;
    }

    if (this.Keys === 19) {
      this.CatId = this.service[18].category[0].id;
      this.id = this.service[17].id;
      this.serviceCat[0] = this.service[18].category;
    }

    if (this.Keys <= 16) {
      this.CatId = this.service[this.Keys].category[0].id;
      this.id = this.service[this.Keys].id;
      this.serviceCat[0] = this.service[this.Keys].category;
    }
  }
}
