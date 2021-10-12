import { UtilService } from "./../../services/util.service";
import { ApiService } from "./../../services/api.service";
import { Component, OnInit } from "@angular/core";
import { NavController } from "@ionic/angular";

@Component({
  selector: "app-select-service",
  templateUrl: "./select-service.page.html",
  styleUrls: ["./select-service.page.scss"],
})
export class SelectServicePage implements OnInit {
  data: any = [];
  err: any = {};
  currency: any;
  constructor(
    private navCtrl: NavController,
    private api: ApiService,
    private util: UtilService
  ) {
    this.util.startLoad();
    this.api
      .getDataWithToken("branch/" + this.api.id + "/branchService")
      .subscribe(
        (res: any) => {
          if (res.success) {
            this.data = res.data;
            this.api.getDataWithToken("payment/setting").subscribe(
              (res: any) => {
                if (res.success) {
                  this.util.dismissLoader();
                  this.currency = res.data.currency_symbol;
                }
              },
              (err) => {
                this.util.dismissLoader();
                this.err = err.error.errors;
              }
            );
          }
        },
        (err) => {
          this.util.dismissLoader();
          this.err = err.error.errors;
        }
      );
  }

  ngOnInit() {}

  bookNow() {
    let temp: any = [];
    if (this.data && this.data.length != 0) {
      this.data.forEach((cat) => {
        if (cat.service && cat.service.length != 0) {
          cat.service.forEach((ser) => {
            if (ser.checked) {
              temp.push(ser);
            }
          });
        }
      });
    }
    if (temp.length == 0) {
      this.util.presentToast("Please Select Service");
    } else {
      this.api.time.service = temp;
      this.api.time.total = this.getTotal.temp;
      this.api.time.duration = this.getTotal.duration;
      this.api.time.discount = 0;
      this.navCtrl.navigateForward("/confirm");
    }

    console.log(temp);
  }
  changecat(id) {
    // var elmnt = document.getElementById(id);
    // elmnt.scrollIntoView();

    var element = document.getElementById(id);
    element.scrollIntoView({
      block: "start",
      behavior: "smooth",
    });
  }
  get getTotal() {
    let temp = 0;
    let duration = 0;

    if (this.data && this.data.length != 0) {
      this.data.forEach((cat) => {
        if (cat.service && cat.service.length != 0) {
          cat.service.forEach((ser) => {
            if (ser.checked) {
              temp += parseFloat(ser.price);
              duration +=
                parseFloat(ser.duration) + parseFloat(ser.preparation_time);
            }
          });
        }
      });
    }

    return {
      temp,
      duration,
    };
  }
}
