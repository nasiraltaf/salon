import { NavController } from "@ionic/angular";
import { UtilService } from "./../../services/util.service";
import { ApiService } from "./../../services/api.service";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-change-password",
  templateUrl: "./change-password.page.html",
  styleUrls: ["./change-password.page.scss"],
})
export class ChangePasswordPage implements OnInit {
  data: any = {};
  err: any = {};
  showpassword = false;
  cshowpassword = false;
  password = false;
  constructor(
    private api: ApiService,
    private util: UtilService,
    private navCtrl: NavController
  ) {}

  ngOnInit() {}

  doChange() {
    this.util.startLoad();
    this.api.postDataWithToken("profile/password/update", this.data).subscribe(
      (res: any) => {
        if (res.success) {
          this.util.dismissLoader();
          this.err = "";
          this.util.presentToast(res.msg);
        } else {
          this.util.presentToast(res.message);
        }
      },
      (err) => {
        this.util.dismissLoader();
        this.util.presentToast(err.error.message);
        this.err = err.error.errors;
      }
    );
  }
}
