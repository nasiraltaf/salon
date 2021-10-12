import { UtilService } from "./../../services/util.service";
import { ApiService } from "./../../services/api.service";
import { Component, OnInit } from "@angular/core";
import { NavController } from "@ionic/angular";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.page.html",
  styleUrls: ["./profile.page.scss"],
})
export class ProfilePage implements OnInit {
  data: any = {};
  err: any = {};
  constructor(
    private navCtrl: NavController,
    private api: ApiService,
    private util: UtilService
  ) {
    this.getUserDate();
  }

  ngOnInit() {}

  editProfile() {
    this.navCtrl.navigateForward("/edit-profile");
  }

  viewPage(path) {
    this.navCtrl.navigateForward(path);
  }

  logOut() {
    localStorage.clear();
    this.navCtrl.navigateRoot("/signin");
  }
  getUserDate() {
    this.util.isUpdateProfile.subscribe((s) => {
      if (!s) {
        this.util.startLoad();
      }

      this.api.getDataWithToken("profile").subscribe(
        (res: any) => {
          console.log("lll");

          this.data = res;

          if (!s) {
            this.util.dismissLoader();
          }
        },
        (err) => {
          if (!s) {
            this.util.dismissLoader();
          }
          this.err = err.error.errors;
        }
      );
    });
  }
}
