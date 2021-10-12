import { UtilService } from "./../../services/util.service";
import { ApiService } from "./../../services/api.service";
import { Component, OnInit } from "@angular/core";
import { NavController } from "@ionic/angular";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.page.html",
  styleUrls: ["./signup.page.scss"],
})
export class SignupPage implements OnInit {
  customOptions: any = {
    header: "Country Code",
  };
  data: any = {};
  err: any = {};
  showpassword = false;
  constructor(
    private navCtrl: NavController,
    private api: ApiService,
    private util: UtilService
  ) {}

  ngOnInit() {}

  doSignUp() {
    // localStorage.setItem("isLogin", "true");
    this.data.device_token = this.api.deviceToken;
    this.util.startLoad();
    this.api.postData("register", this.data).subscribe(
      (res: any) => {
        if (res.success) {
          this.util.dismissLoader();
          this.util.presentToast(res.msg);
          if (res.data.token) {
            this.navCtrl.navigateRoot("/tabs/home");
            localStorage.setItem("token", res.data.token);
            this.api.userToken = res.data.token;
          } else {
            if (res.flow == "verification") {
              this.api.verifyMo = this.data.phone_no;
              this.navCtrl.navigateForward("/phone-number");
            }
          }
        }
      },
      (err) => {
        this.util.dismissLoader();
        this.err = err.error.errors;
      }
    );
  }

  doSignIn() {
    this.navCtrl.navigateForward("/signin");
  }
}
