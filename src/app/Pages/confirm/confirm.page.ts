import { UtilService } from "./../../services/util.service";
import { ApiService } from "./../../services/api.service";
import { Component, OnInit } from "@angular/core";
import { NavController } from "@ionic/angular";
import * as moment from "moment";
@Component({
  selector: "app-confirm",
  templateUrl: "./confirm.page.html",
  styleUrls: ["./confirm.page.scss"],
})
export class ConfirmPage implements OnInit {
  serviceList: any = [];
  data: any = {};
  err: any = {};
  seldate: any;
  timeslot: any;
  discount: number = 0;
  total: number = 0;
  duration: number = 0;
  isemployee = true;
  currency: any;
  constructor(
    private navCtrl: NavController,
    private api: ApiService,
    private util: UtilService
  ) {
    this.util.startLoad();
    this.api.getDataWithToken("branch/" + this.api.id).subscribe(
      (res: any) => {
        if (res.success) {
          this.total = this.api.time.total;
          this.duration = this.api.time.duration;
          this.data = res.data;
          this.seldate = this.api.time.date;
          this.timeslot = this.api.time.timeslot;

          let rdata: any = {
            service: [],
            branch_id: this.api.id,
          };
          this.api.time.service.forEach((element) => {
            let puher = {
              id: element.id,
              time: element.duration + element.preparation_time,
            };
            rdata.service.push(puher);
          });
          rdata.service = JSON.stringify(rdata.service);
          this.seldate = moment(this.seldate).format("YYYY-MM-DD");
          rdata.start_time =
            this.seldate +
            " " +
            moment(this.timeslot, "h:mm a").format("HH:mm:ss");

          this.api.postDataWithToken("available/employee", rdata).subscribe(
            (res: any) => {
              if (res.success) {
                this.util.dismissLoader();
                this.serviceList = res.data;
                this.serviceList.forEach((element) => {
                  element.employee_data.forEach((emp) => {
                    emp.isselect = false;
                    emp.empshow = false;
                  });

                  if (
                    element.employee_data &&
                    element.employee_data.length != 0
                  ) {
                    element.selectedEmp = element.employee_data[0].emp_id;
                  } else {
                    this.isemployee = false;
                  }
                });

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
      },
      (err) => {
        this.util.dismissLoader();
        this.err = err.error.errors;
      }
    );
  }

  ngOnInit() { }
  ionViewWillEnter() {
    if (this.api.time.discount) {
      this.discount = this.api.time.discount;
    }
  }

  applyPromo() {
    this.navCtrl.navigateForward("/offer");
  }

  bookNow() {
    if (this.isemployee) {
      let temp: any = [];
      this.serviceList.forEach((ser) => {
        temp.push({
          emp_id: ser.selectedEmp,
          service_id: ser.service_data.id,
          duration: ser.time,
        });
      });

      this.api.time.order = temp;
      this.navCtrl.navigateForward("/payment");
    } else {
      this.util.presentToast("Employee is not available");
    }
  }
  transform(time: any): any {
    let hour = time.split(":")[0];
    let min = time.split(":")[1];
    let part = hour > 12 ? "PM" : "AM";
    min = (min + "").length == 1 ? `0${min}` : min;
    hour = hour > 12 ? hour - 12 : hour;
    hour = (hour + "").length == 1 ? `0${hour}` : hour;
    return `${hour}:${min} ${part}`;
  }

  selectEmployee(data, selectedEmp) {
    data.selectedEmp = selectedEmp.emp_id;
    data.employee_data.forEach((emp) => {
      emp.selected = false;
      if (emp.emp_id == selectedEmp.emp_id) {
        emp.selected = true;
      }
    });
  }
}
