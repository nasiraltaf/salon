import { Stripe } from "@ionic-native/stripe/ngx";
import {
  PayPal,
  PayPalConfiguration,
  PayPalPayment,
} from "@ionic-native/paypal/ngx";
import { UtilService } from "./../../services/util.service";
import { ApiService } from "./../../services/api.service";
import { Component, OnInit } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { SuccessModalPage } from "../success-modal/success-modal.page";
declare var RazorpayCheckout: any;
import * as moment from "moment";
@Component({
  selector: "app-payment",
  templateUrl: "./payment.page.html",
  styleUrls: ["./payment.page.scss"],
})
export class PaymentPage implements OnInit {
  total: number = 0;

  data: any = {};
  err: any = {};
  payment_method: any = "Offline";

  cardData: any = {
    // number: "4242424242424242",
    // expMonth: 12,
    // expYear: 2020,
    // cvc: "220",
  };
  constructor(
    private modalCtrl: ModalController,
    private api: ApiService,
    private util: UtilService,
    private payPal: PayPal,
    private stripe: Stripe
  ) {
    console.log(this.api.time);

    this.total = this.api.time.total - this.api.time.discount;
    this.util.startLoad();
    this.api.getDataWithToken("payment/setting").subscribe(
      (res: any) => {
        if (res.success) {
          this.util.dismissLoader();
          this.data = res.data;
          this.stripe.setPublishableKey(this.data.STRIPE_KEY);
        }
      },
      (err) => {
        this.util.dismissLoader();
        this.err = err.error.errors;
      }
    );
  }

  ngOnInit() {}

  localPay() {
    let info: any = {};
    info.branch_id = this.api.id;

    if (this.api.time.offer_id) {
      info.offer_id = this.api.time.offer_id;
    } else {
      info.offer_id = null;
    }
    info.total = this.total;
    info.discount = this.api.time.discount;
    info.duration = this.api.time.duration;
    info.payment_status = 0;
    info.start_time = moment(this.api.time.date).format("YYYY-MM-DD");
    info.start_time =
      info.start_time +
      " " +
      moment(this.api.time.timeslot, "h:mm a").format("HH:mm:ss");
    info.service = JSON.stringify(this.api.time.order);
    info.payment_method = this.payment_method;
    console.log(info);
    //return;

    this.util.startLoad();
    this.api.postDataWithToken("booking", info).subscribe(
      (res: any) => {
        if (res.success) {
          this.util.dismissLoader();
          this.api.bookid = res.data;
          this.api.time = {};
          this.payNow();
        }
      },
      (err) => {
        this.util.dismissLoader();
        this.err = err.error.errors;
      }
    );
  }
  async payNow() {
    const modal = await this.modalCtrl.create({
      component: SuccessModalPage,
      backdropDismiss: false,
      cssClass: "success-modal",
    });
    return await modal.present();
  }
  private orderDone(payment_id) {
    console.log(payment_id);

    let info: any = {};
    info.branch_id = this.api.id;
    info.offer_id = this.api.time.offer_id;
    info.total = this.total;
    info.discount = this.api.time.discount;
    info.duration = this.api.time.duration;
    info.payment_status = 1;
    info.payment_token = payment_id;
    info.start_time = moment(this.api.time.date).format("YYYY-MM-DD");
    info.start_time =
      info.start_time +
      " " +
      moment(this.api.time.timeslot, "h:mm a").format("HH:mm:ss");
    info.service = JSON.stringify(this.api.time.order);
    info.payment_method = this.payment_method;

    this.util.startLoad();
    this.api.postDataWithToken("booking", info).subscribe(
      (res: any) => {
        if (res.success) {
          this.util.dismissLoader();
          this.api.bookid = res.data;
          this.api.time = {};
          this.payNow();
        }
      },
      (err) => {
        this.util.dismissLoader();
        this.err = err.error.errors;
      }
    );
  }
  payWithPaypal() {
    console.log("from paypal");

    this.payPal
      .init({
        PayPalEnvironmentProduction: this.data.P_PRODUCTION_CLIENT_ID,
        PayPalEnvironmentSandbox: this.data.P_SANDBOX_CLIENT_ID,
      })
      .then(
        () => {
          // Environments: PayPalEnvironmentNoNetwork, PayPalEnvironmentSandbox, PayPalEnvironmentProduction
          this.payPal
            .prepareToRender(
              "PayPalEnvironmentSandbox",
              new PayPalConfiguration({
                // Only needed if you get an "Internal Service Error" after PayPal login!
                //payPalShippingAddressOption: 2 // PayPalShippingAddressOptionPayPal
              })
            )
            .then(
              () => {
                let payment = new PayPalPayment(
                  this.total.toString(),
                  this.data.currency,
                  "Beauty Belle",
                  "sale"
                );
                this.payPal.renderSinglePaymentUI(payment).then(
                  (res) => {
                    this.orderDone(res.response.id);
                    // Successfully paid
                    // Example sandbox response
                    //
                    // {
                    //   "client": {
                    //     "environment": "sandbox",
                    //     "product_name": "PayPal iOS SDK",
                    //     "paypal_sdk_version": "2.16.0",
                    //     "platform": "iOS"
                    //   },
                    //   "response_type": "payment",
                    //   "response": {
                    //     "id": "PAY-1AB23456CD789012EF34GHIJ",
                    //     "state": "approved",
                    //     "create_time": "2016-10-03T13:33:33Z",
                    //     "intent": "sale"
                    //   }
                    // }
                  },
                  (err) => {
                    // Error or render dialog closed without being successful
                    console.log("from paypal", err);
                    this.util.presentToast("currency not supported");
                  }
                );
              },
              (err) => {
                // Error in configuration
                console.log("from paypal", err);
                this.util.presentToast(err);
              }
            );
        },
        (err) => {
          console.log("from paypal", err);
          this.util.presentToast(err);
          // Error in initialization, maybe PayPal isn't supported or something else
        }
      );
  }
  payWithRazor() {
    let options = {
      description: "Beauty Belle",
      image: "https://i.imgur.com/3g7nmJC.png",
      currency: this.data.currency, // your 3 letter currency code
      key: this.data.RAZOR_ID, // your Key Id from Razorpay dashboard
      amount: this.total * 100, // Payment amount in smallest denomiation e.g. cents for USD
      name: "Beauty Belle",

      theme: {
        color: "#fecd03",
      },
      modal: {
        ondismiss() {
          alert("Please complete your payment.");
        },
      },
    };

    let successCallback = (payment_id) => {
      this.orderDone(payment_id);
      // this.util.presentToast(payment_id);
    };

    let cancelCallback = function (error) {
      this.util.presentToast("errorr");
      alert(error.description + " (Error " + error.code + ")");
    };

    RazorpayCheckout.open(options, successCallback, cancelCallback);
  }

  stripePayment() {
    this.util.startLoad();
    this.stripe
      .createCardToken(this.cardData)
      .then((token) => {
        this.util.dismissLoader();
        this.orderDone(token.id);
      })
      .catch((error) => console.error(error));
  }
  Payment() {
    if (this.payment_method == "Razorpay") {
      this.payWithRazor();
    } else if (this.payment_method == "Strip") {
      this.stripePayment();
    } else if (this.payment_method == "Paypal") {
      this.payWithPaypal();
    } else {
      this.localPay();
    }
  }
}
