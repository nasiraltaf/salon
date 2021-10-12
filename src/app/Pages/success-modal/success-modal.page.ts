import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-success-modal',
  templateUrl: './success-modal.page.html',
  styleUrls: ['./success-modal.page.scss'],
})
export class SuccessModalPage implements OnInit {

  constructor(private modalCtrl:ModalController,private navCtrl:NavController) { 
    setTimeout(() => {
      this.modalCtrl.dismiss();
      this.navCtrl.navigateRoot('/booking-confirm');
    }, 4000);
  }


  ngOnInit() {
  }

}
