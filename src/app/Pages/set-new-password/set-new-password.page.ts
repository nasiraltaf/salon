import { UtilService } from "./../../services/util.service";
import { ApiService } from "./../../services/api.service";
import { Component, OnInit } from "@angular/core";
import { NavController } from "@ionic/angular";

@Component({
  selector: "app-set-new-password",
  templateUrl: "./set-new-password.page.html",
  styleUrls: ["./set-new-password.page.scss"],
})
export class SetNewPasswordPage implements OnInit {
  data: any = {};
  err: any = {};
  showpassword = false;
  cshowpassword = false;
  constructor(
    private navCtrl: NavController,
    private api: ApiService,
    private util: UtilService
  ) {}

  ngOnInit() {}

  doChange() {
    this.util.startLoad();
    this.api.postDataWithToken("newpassword", this.data).subscribe(
      (res: any) => {
        if (res.success) {
          this.util.dismissLoader();
          localStorage.setItem("isLogin", "true");
          this.util.presentToast(res.msg);
          this.navCtrl.navigateRoot("/tabs/home");
        }
      },
      (err) => {
        this.util.dismissLoader();
        this.err = err.error.errors;
        this.util.presentToast(this.err.password[0]);
      }
    );
    // this.navCtrl.navigateRoot('/signin');
  }
}
