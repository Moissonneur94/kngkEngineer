import { Component, OnInit } from "@angular/core";
import { LoadingController, NavController } from "ionic-angular";
import { HomeComponent } from "../home/home";
import { GetDataService } from "../../app/service/getData.service";

import { Storage } from "@ionic/storage";

@Component({
  selector: "login",
  templateUrl: "login.html"
})
export class LoginComponent implements OnInit {
  public user: string = "";
  public password: string = "";
  public saveUser: boolean = false;

  public errorHeader: string = null;
  public errorText: string = null;

  constructor(
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public data: GetDataService,
    public storage: Storage
  ) {}

  public ngOnInit() {
    this.data.clearAuth();

    this.storage.get("user").then(user => (this.user = user));
    this.storage.get("saveUser").then(saveUser => (this.saveUser = saveUser));
    this.storage.get("password").then(password => (this.password = password));
  }

  private setSaveUser() {
    if (this.saveUser === true) {
      this.storage.set("saveUser", true);
      this.storage.set("user", this.user);
      this.storage.set("password", this.password);
    } else {
      this.storage.set("saveUser", false);
      this.storage.set("user", "");
      this.storage.set("password", "");
    }
  }

  private userLogin() {
    this.setSaveUser();

    this.errorHeader = "";
    this.errorText = "";

    const loader = this.loadingCtrl.create({
      content: "Пожалуйста подождите пока выполняется вход..."
    });
    loader.present();

    this.data.setAuth(this.user, this.password);

    this.data.GetUser(this.user).subscribe(
      user => {
        this.navCtrl.setRoot(HomeComponent, null, null, () => {
          loader.dismiss();
        });
      },
      error => {
        loader.dismiss();
        this.errorHeader = error["faultheader"];
        this.errorText = error["faultstring"];
      }
    );
  }
}
