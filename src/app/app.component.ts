import { ApiService } from "./services/api.service";
import { Component, ViewChildren, QueryList } from "@angular/core";

import {
  Platform,
  NavController,
  ToastController,
  IonRouterOutlet,
} from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { Router } from "@angular/router";
import { OneSignal } from "@ionic-native/onesignal/ngx";
@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
})
export class AppComponent {
  @ViewChildren(IonRouterOutlet) routerOutlets: QueryList<IonRouterOutlet>;
  lastTimeBackPress = 0;
  timePeriodToExit = 2000;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private api: ApiService,
    private router: Router,
    private oneSignal: OneSignal,
    private navCtrl: NavController,
    private toastController: ToastController
  ) {
    this.initializeApp();
    if (localStorage.getItem("token")) {
      this.navCtrl.navigateRoot("/tabs/home");
    } else {
      this.navCtrl.navigateRoot("signin");
    }
    this.backButtonEvent();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // this.statusBar.styleDefault();
      this.statusBar.backgroundColorByHexString("#fecd03");
      this.splashScreen.hide();
      setTimeout(() => {
        this.api.getData("noti/setting").subscribe(
          (res: any) => {
            if (res.success) {
              if (this.platform.is("cordova")) {
                this.oneSignal.startInit(
                  res.data.APP_ID,
                  res.data.PROJECT_NUMBER
                );
                this.oneSignal
                  .getIds()
                  .then((ids) => (this.api.deviceToken = ids.userId));
                this.oneSignal.endInit();
              } else {
                this.api.deviceToken = null;
              }
            }
          },
          (err) => {}
        );
      }, 500);
    });
  }
  backButtonEvent() {
    this.platform.backButton.subscribe(async () => {
      this.routerOutlets.forEach((outlet: IonRouterOutlet) => {
        if (outlet && outlet.canGoBack()) {
          outlet.pop();
        } else if (
          this.router.url === "/tabs/home" ||
          this.router.url === "/tabs/appointment" ||
          this.router.url === "/tabs/profile" ||
          this.router.url === "/signin" ||
          this.router.url === "/signup-option"
        ) {
          if (
            new Date().getTime() - this.lastTimeBackPress <
            this.timePeriodToExit
          ) {
            navigator["app"].exitApp();
          } else {
            this.showToast();
            this.lastTimeBackPress = new Date().getTime();
          }
        }
      });
    });
  }
  async showToast() {
    const toast = await this.toastController.create({
      message: "press back again to exit App.",
      duration: 2000,
      cssClass: "leaveToast",
    });
    toast.present();
  }
}
