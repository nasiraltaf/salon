import { UtilService } from "./../../services/util.service";
import { ApiService } from "./../../services/api.service";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-favorites",
  templateUrl: "./favorites.page.html",
  styleUrls: ["./favorites.page.scss"],
})
export class FavoritesPage implements OnInit {
  data: any = [];
  err: any = {};
  constructor(private api: ApiService, private util: UtilService) {
    this.util.startLoad();
    this.api.getDataWithToken("favorite/salon").subscribe(
      (res: any) => {
        if (res.success) {
          this.data = res.data;
          this.util.dismissLoader();
        }
      },
      (err) => {
        this.util.dismissLoader();
        this.err = err.error.errors;
      }
    );
  }

  ngOnInit() {}

  doRefresh(event) {
    this.api.getDataWithToken("favorite/salon").subscribe(
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
