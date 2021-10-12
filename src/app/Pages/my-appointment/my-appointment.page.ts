import { UtilService } from "./../../services/util.service";
import { ApiService } from "./../../services/api.service";
import { Component, OnInit } from "@angular/core";
import { NavController } from "@ionic/angular";

@Component({
  selector: "app-my-appointment",
  templateUrl: "./my-appointment.page.html",
  styleUrls: ["./my-appointment.page.scss"],
})
export class MyAppointmentPage implements OnInit {
  activeSegment: any = "Upcoming";
  data: any = {};
  appoinment: any = [
    {
      name: "Addictive Beauty",
      address: "West minister Business Road, UK",
      price: 42,
      date: "16, April 2020 - 05:00 pm",
      image: "../../../assets/Images/aductive_small.png",
    },
    {
      name: "Addictive Beauty",
      address: "West minister Business Road, UK",
      price: 85,
      date: "22, April 2020 - 03:30 pm",
      image: "../../../assets/Images/aductive_small.png",
    },
  ];
  err: any = {};
  constructor(
    private navCtrl: NavController,
    private api: ApiService,
    private util: UtilService
  ) {
    this.util.startLoad();
    this.api.getDataWithToken("booking").subscribe(
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

  viewDetail(id) {
    this.api.bookid = id;
    this.navCtrl.navigateForward("/past-order-detail");
  }
  gotoHome() {
    this.navCtrl.navigateRoot("tabs/home");
  }
  doRefresh(event) {
    this.api.getDataWithToken("booking").subscribe(
      (res: any) => {
        if (res.success) {
          this.data = res.data;
          event.target.complete();
        }
      },
      (err) => {
        event.target.complete();
      }
    );
  }
}
