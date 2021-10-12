import { Component, OnInit } from "@angular/core";
import { ModalController } from "@ionic/angular";

@Component({
  selector: "app-sort-modal1",
  templateUrl: "./sort-modal1.page.html",
  styleUrls: ["./sort-modal1.page.scss"],
})
export class SortModal1Page implements OnInit {
  sort = "";
  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {}

  closeModal() {
    this.modalCtrl.dismiss();
  }
  ionViewWillEnter() {
    this.sort = localStorage.getItem("sort");
    console.log("this.category: ", this.sort);
  }
  filter(val) {
    localStorage.setItem("sort", val);
    this.modalCtrl.dismiss(val);
  }
}
