import { Component, ViewChild } from "@angular/core";
import { IonTabs } from "@ionic/angular";
import { Router } from "@angular/router";
import { NavController } from "@ionic/angular";

@Component({
  selector: "app-tabs",
  templateUrl: "tabs.page.html",
  styleUrls: ["tabs.page.scss"],
})
export class TabsPage {
  activeTab: any = "/tabs/home";
  constructor(private router: Router, private navCtrl: NavController) {}

  getSelectedTab() {
    this.activeTab = this.router.url;
  }
  
   viewPage(path) { ;
    this.navCtrl.navigateForward(path);
  }
 
  
}
