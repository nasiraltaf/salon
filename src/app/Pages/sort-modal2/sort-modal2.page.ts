import { Component, OnInit } from "@angular/core";
import { ModalController } from "@ionic/angular";

@Component({
  selector: "app-sort-modal2",
  templateUrl: "./sort-modal2.page.html",
  styleUrls: ["./sort-modal2.page.scss"],
})
export class SortModal2Page implements OnInit {
  category = "";

  constructor(private modalCtrl: ModalController) {}

  ionViewWillEnter() {
    this.category = localStorage.getItem("genderFilter");
    console.log("this.category: ", this.category);
  }

  ngOnInit() {}

  closeModal() {
    this.modalCtrl.dismiss();
  }
  filter(val) {
    localStorage.setItem("genderFilter", val);
    this.modalCtrl.dismiss(val);
  }
}
