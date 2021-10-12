import { UtilService } from "./../../services/util.service";
import { ApiService } from "./../../services/api.service";
import { Component, OnInit } from "@angular/core";
import { NavController } from "@ionic/angular";

@Component({
  selector: "app-forgot-password",
  templateUrl: "./forgot-password.page.html",
  styleUrls: ["./forgot-password.page.scss"],
})
export class ForgotPasswordPage implements OnInit {
  data: any = {};
  err: any = {};
  constructor(
    private navCtrl: NavController,
    private api: ApiService,
    private util: UtilService
  ) {}

  ngOnInit() {}

  doNext() {
    this.data.type = 0;
    this.util.startLoad();
    this.api.postData("forgot", this.data).subscribe(
      (res: any) => {
        if (res.success) {
          this.util.dismissLoader();
          this.util.presentToast(res.msg);
          this.api.phone_no = this.data.phone_no;
          this.navCtrl.navigateForward("/otp");
        } else {
          this.util.dismissLoader();
          this.util.presentToast(res.msg);
        }
      },
      (err) => {
        this.util.dismissLoader();
        this.err = err.error.errors;
      }
    );
  }
}
