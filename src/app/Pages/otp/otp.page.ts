import { UtilService } from "./../../services/util.service";
import { ApiService } from "./../../services/api.service";
import { Component, OnInit, ViewChild } from "@angular/core";
import { NavController } from "@ionic/angular";

@Component({
  selector: "app-otp",
  templateUrl: "./otp.page.html",
  styleUrls: ["./otp.page.scss"],
})
export class OTPPage implements OnInit {
  @ViewChild("a", { static: true }) a;
  @ViewChild("b", { static: true }) b;
  @ViewChild("c", { static: true }) c;
  @ViewChild("d", { static: true }) d;
  data: any = {};
  otp: any = {};
  err: any = {};
  constructor(
    private navCtrl: NavController,
    private api: ApiService,
    private util: UtilService
  ) {}

  ngOnInit() {
    setTimeout(() => {
      this.a.setFocus();
    }, 300);
  }

  moveFocus(event, nextElement, previousElement) {
    if (event.keyCode == 8 && previousElement) {
      previousElement.setFocus();
    } else if (event.keyCode >= 48 && event.keyCode <= 57) {
      if (nextElement) {
        nextElement.setFocus();
      }
    } else {
      event.path[0].value = "";
    }
  }

  doDone() {
    this.data.otp = this.otp.a + this.otp.b + this.otp.c + this.otp.d;
    this.data.type = 0;
    this.data.phone_no = this.api.phone_no;
    this.util.startLoad();
    this.api.postData("forgot/validate", this.data).subscribe(
      (res: any) => {
        if (res.success) {
          this.util.dismissLoader();
          this.util.presentToast(res.msg);
          localStorage.setItem("token", res.data.token);
          this.api.userToken = res.data.token;
          this.navCtrl.navigateForward("/set-new-password");
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
