import { UtilService } from "./../../services/util.service";
import { ApiService } from "./../../services/api.service";
import { Component, OnInit } from "@angular/core";
import { ModalController, NavController } from "@ionic/angular";
import { SortModal1Page } from "../sort-modal1/sort-modal1.page";
import { SortModal2Page } from "../sort-modal2/sort-modal2.page";

@Component({
  selector: "app-salon-list",
  templateUrl: "./salon-list.page.html",
  styleUrls: ["./salon-list.page.scss"],
})
export class SalonListPage implements OnInit {
  data: any = [];
  err: any = {};
  genderFilter: any = { for_who: 0 };
  type: any = "";
  sortType: any;
  catgoryName: any;
  constructor(
    private modalCtrl: ModalController,
    private navCtrl: NavController,
    private api: ApiService,
    private util: UtilService
  ) {
    this.catgoryName = this.api.category;
    this.util.startLoad();
    this.api.getDataWithToken("category/" + this.api.id + "/branch").subscribe(
      (res: any) => {
        if (res.success) {
          this.util.dismissLoader();
          this.data = res.data;
          //console.log("this.data: ", this.data);
        }
      },
      (err) => {
        this.util.dismissLoader();
        this.err = err.error.errors;
      }
    );
  }

  ionViewWillEnter() {
    if (localStorage.getItem("genderFilter")) {
      this.type = localStorage.getItem("genderFilter");
      console.log("this.genderFilter.type: ", this.genderFilter.type);
    } else {
      localStorage.setItem("genderFilter", "Men Women");
      this.type = "Men Women";
    }
    if (localStorage.getItem("sort")) {
      this.sortType = localStorage.getItem("sort");
      console.log("this ", this.sortType);
    } else {
      localStorage.setItem("sort", "Top rated");
      this.sortType = "Top rated";
    }
    this.genderFilterFunc();
  }
  doRefresh(event) {
    // this.getUserDate();
    this.api.getDataWithToken("category/" + this.api.id + "/branch").subscribe(
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
  ngOnInit() {}
  viewInMap() {
    this.navCtrl.navigateForward("/map-with-salon");
  }

  async presentTopratedModal() {
    const modal = await this.modalCtrl.create({
      component: SortModal1Page,
      backdropDismiss: false,
      cssClass: "sort-modal",
    });
    modal.onDidDismiss().then((data) => {
      console.log("data", data);
      this.sortType = data.data;
      if (data["data"] != undefined) {
        //this.genderFilter.for_who = ;
        //this.rdata = data.data;
        this.filterSort();
      }
    });
    return await modal.present();
  }

  async presentCategoryModal() {
    const modal = await this.modalCtrl.create({
      component: SortModal2Page,
      backdropDismiss: false,
      cssClass: "sort-modal1",
    });
    modal.onDidDismiss().then((data) => {
      this.type = data.data;
      console.log(" this.type: ", this.type);
      if (data["data"] != undefined) {
        this.genderFilterFunc();
      }
    });
    return await modal.present();
  }

  genderFilterFunc() {
    if (this.type == "Women") {
      this.genderFilter.for_who = 1;
    } else if (this.type == "Men") {
      this.genderFilter.for_who = 2;
    } else {
      this.genderFilter.for_who = "";
    }
  }
  filterSort() {
    let info: any;
    console.log(this.sortType);

    if (this.sortType == "Top rated") {
      info = 3;
    } else if (this.sortType == "Featured") {
      info = 2;
    } else if (this.sortType == "Newest") {
      info = 1;
    } else {
      info = 4;
    }

    this.util.startLoad();
    this.api.getDataWithToken("filleter/branch/" + info).subscribe(
      (res: any) => {
        console.log("res: ", res);
        if (res.success) {
          this.util.dismissLoader();
          this.data = res.data;
        }
      },
      (err) => {
        this.util.dismissLoader();
      }
    );
    console.log(info);
  }

  viewSlonDetail(id) {
    this.api.id = id;
    this.navCtrl.navigateForward("/salon-detail");
  }
}
