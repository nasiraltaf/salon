import { UtilService } from "./../../services/util.service";
import { ApiService } from "./../../services/api.service";
import { Component, OnInit } from "@angular/core";
import { NavController } from "@ionic/angular";

import {ViewChild} from '@angular/core';
import { IonSlides } from '@ionic/angular';

@Component({
  selector: "app-home",
  templateUrl: "./home.page.html",
  styleUrls: ["./home.page.scss"],
})
export class HomePage implements OnInit {
	
  @ViewChild('slideWithNav2', { static: false }) slideWithNav2: IonSlides;

 @ViewChild('slideWithNav3', { static: false }) slideWithNav3: IonSlides;
  @ViewChild('slideWithNav1', { static: false }) slideWithNav1: IonSlides;
 sliderOne: any;sliderTwo: any;sliderThree: any;
  slideOptsOne = {initialSlide:0,slidesPerView:2,autoplay: true,};
  slideOptsTwo = {initialSlide: 0,slidesPerView: 1,autoplay: true};
  slideOptsThree={initialSlide:0,slidesPerView:2,autoplay: true};
	
  data: any = {};rdata: any = {}; err: any = {};

  constructor(
    private navCtrl: NavController,
    private api: ApiService,
    private util: UtilService
  ) {
	  
	  
	   //Item object for Food
    this.sliderOne =
    {
      isBeginningSlide: true,
      isEndSlide: false,
      slidesItems: [
        {
          id: 324
        }
      ]
    };   
	   //Item object for Food
    this.sliderTwo =
    {
      isBeginningSlide: true,
      isEndSlide: false,
      slidesItems: [
        {
          id: 324
        }
      ]
    };
    //Item object for Fashion
    this.sliderThree =
    {
      isBeginningSlide: true,
      isEndSlide: false,
      slidesItems: [
        {
          id: 643
        }
      ]
    };

  
 
	  
	  
	  
	  
	  
    this.getUserDate();
    this.util.startLoad();
    this.api.getDataWithToken("home").subscribe(
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


//Move to Next slide
  slideNext(object, slideView) {
    slideView.slideNext(500).then(() => {
      this.checkIfNavDisabled(object, slideView);
    });
  }

  //Move to previous slide
  slidePrev(object, slideView) {
    slideView.slidePrev(500).then(() => {
      this.checkIfNavDisabled(object, slideView);
    });;
  }

  //Method called when slide is changed by drag or navigation
  SlideDidChange(object, slideView) {
    this.checkIfNavDisabled(object, slideView);
  }

  //Call methods to check if slide is first or last to enable disbale navigation  
  checkIfNavDisabled(object, slideView) {
    this.checkisBeginning(object, slideView);
    this.checkisEnd(object, slideView);
  }

  checkisBeginning(object, slideView) {
    slideView.isBeginning().then((istrue) => {
      object.isBeginningSlide = istrue;
    });
  }
  checkisEnd(object, slideView) {
    slideView.isEnd().then((istrue) => {
      object.isEndSlide = istrue;
    });
  }
  ngOnInit() {}
  doRefresh(event) {
    this.api.getDataWithToken("home").subscribe(
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

  viewList(id) {
    this.api.id = id.id;
    this.api.category = id.name;
    this.navCtrl.navigateForward("/salon-list");
  }
  getUserDate() {
    this.util.isUpdateProfile.subscribe((s) => {
      if (!s) {
        this.util.startLoad();
      }

      this.api.getDataWithToken("profile").subscribe(
        (res: any) => {
          this.rdata = res;

          if (!s) {
            this.util.dismissLoader();
          }
        },
        (err) => {
          if (!s) {
            this.util.dismissLoader();
          }
          this.err = err.error.errors;
        }
      );
    });
  }
  viewSlonDetail(id) {
    this.api.id = id;
    this.navCtrl.navigateForward("/salon-detail");
  }
}
