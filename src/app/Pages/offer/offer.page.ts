import { UtilService } from "./../../services/util.service";
import { ApiService } from "./../../services/api.service";
import { Component, OnInit } from "@angular/core";
import { NavController } from "@ionic/angular";

@Component({
  selector: "app-offer",
  templateUrl: "./offer.page.html",
  styleUrls: ["./offer.page.scss"],
})
export class OfferPage implements OnInit {
  data: any = [];
  err: any = {};

  constructor(
    private navCtrl: NavController,
    private api: ApiService,
    private util: UtilService
  ) {
    this.util.startLoad();
    this.api.getDataWithToken("offer").subscribe(
      (res: any) => {
        if (res.success) {
          this.util.dismissLoader();
          this.data = res.data;
        }
      },
      (err) => {
        this.util.dismissLoader();
        this.err = err.error.errors;
      }
    );
  }

  ngOnInit() {}

  doapply(item) {
    let rdta: any = {};
    rdta.id = item.id;
    rdta.amount = this.api.time.total;
    this.util.startLoad();
    this.api.postDataWithToken("applyCode", rdta).subscribe(
      (res: any) => {
        if (res.success) {
          this.util.dismissLoader();
          if (res.data.discount_type == 0) {
            this.api.time.discount = res.data.discount;
            this.api.time.offer_id = res.data.id;
            this.navCtrl.back();
          } else {
            this.api.time.discount = Number(
              ((this.api.time.total * res.data.discount) / 100).toFixed(2)
            );
            this.navCtrl.back();
          }
        } else {
          this.util.dismissLoader();
          this.api.time.discount = 0;
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
