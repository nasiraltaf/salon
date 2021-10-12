import { UtilService } from "./../../services/util.service";
import { ApiService } from "./../../services/api.service";
import { Component, OnInit } from "@angular/core";
import { Data } from "@angular/router";

@Component({
  selector: "app-past-order-detail",
  templateUrl: "./past-order-detail.page.html",
  styleUrls: ["./past-order-detail.page.scss"],
})
export class PastOrderDetailPage implements OnInit {
  data: any = {};
  err: any = {};
  rdata: any = {};
  constructor(private api: ApiService, private util: UtilService) {
    this.util.startLoad();
    this.api.getDataWithToken("booking/" + this.api.bookid).subscribe(
      (res: any) => {
        if (res.success) {
          this.util.dismissLoader();
          this.data = res.data;
          if (res.data.review) {
            this.rdata = this.data.review;
          }
        }
      },
      (err) => {
        this.util.dismissLoader();
        this.err = err.error.errors;
      }
    );
  }

  ngOnInit() {}
  review() {
    this.rdata.branch_id = this.data.branch_id;
    this.rdata.booking_id = this.data.id;

    this.util.startLoad();
    this.api.postDataWithToken("review", this.rdata).subscribe(
      (res: any) => {
        if (res.success) {
          this.util.presentToast(res.msg);
          this.api.getDataWithToken("booking/" + this.api.bookid).subscribe(
            (res: any) => {
              if (res.success) {
                this.util.dismissLoader();
                this.data = res.data;
                if (res.data.review) {
                  this.rdata = this.data.review;
                }
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
}
