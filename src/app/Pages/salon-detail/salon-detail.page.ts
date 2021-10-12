import { UtilService } from "./../../services/util.service";
import { ApiService } from "./../../services/api.service";
import { Component, OnInit } from "@angular/core";
import { NavController } from "@ionic/angular";

@Component({
  selector: "app-salon-detail",
  templateUrl: "./salon-detail.page.html",
  styleUrls: ["./salon-detail.page.scss"],
})
export class SalonDetailPage implements OnInit {
  data: any = {};
  err: any = {};
  reviewList: any = [
    {
      name: "Martha Valdez",
      date: "28 Jan 2020",
      image: "../../../assets/Images/alexandr.png",
      description:
        "Duis pretium gravida enim, vel maximus ligula fermentum a. Sed rhoncus eget ex id egestas. Nam nec nisl placerat, tempu",
      rate: "5",
    },
    {
      name: "Sara Willis",
      date: "27 Jan 2020",
      image: "../../../assets/Images/barbara.png",
      description:
        "Duis pretium gravida enim, vel maximus ligula fermentum a. Sed rhoncus eget ex id egestas. Nam nec nisl placerat, tempu",
      rate: "4",
    },
  ];
  salonList: any = [
    {
      title: "Addictive Beauty",
      address: "West minister Business Road, UK",
      distance: 1,
      type: "WOMEN ONLY",
      image: "../../../assets/Images/13e317bceaec87ea47dacfff7386d606.png",
    },
    {
      title: "Barbarella Salon",
      address: "West minister Business Road, UK",
      distance: 1,
      image: "../../../assets/Images/3b09f1f04df3bbe9bf96f1c737a91781.png",
    },
  ];
  state: any = 1;
  constructor(
    private navCtrl: NavController,
    private api: ApiService,
    private util: UtilService
  ) {
    this.util.startLoad();
    this.api.getDataWithToken("branch/" + this.api.id).subscribe(
      (res: any) => {
        if (res.success) {
          this.util.dismissLoader();
          this.data = res.data;

          this.data.start_time = this.transform(this.data.start_time);
          this.data.end_time = this.transform(this.data.end_time);
        }
      },
      (err) => {
        this.util.dismissLoader();
        this.err = err.error.errors;
      }
    );
  }

  ngOnInit() {}

  logScrolling(ev) {
    if (ev.detail.scrollTop >= 200) {
      this.state = 2;
    } else {
      this.state = 1;
    }
  }

  bookNow() {
    this.navCtrl.navigateForward("/select-time");
  }
  transform(time: any): any {
    let hour = time.split(":")[0];
    let min = time.split(":")[1];
    let part = hour >= 12 ? "pm" : "am";
    min = (min + "").length == 1 ? `0${min}` : min;
    hour = hour > 12 ? hour - 12 : hour;
    hour = (hour + "").length == 1 ? `0${hour}` : hour;
    return `${hour}:${min} ${part}`;
  }
  isfavrite(id) {
    this.util.startLoad();
    this.api.getDataWithToken("favorite/salon/" + id).subscribe(
      (res: any) => {
        if (res.success) {
          this.util.dismissLoader();
          if (this.data.fev == 0) {
            this.data.fev = 1;
          } else {
            this.data.fev = 0;
          }
        }
      },
      (err) => {
        this.util.dismissLoader();
        this.err = err.error.errors;
      }
    );
  }
}
