import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'show-list-notifications',
  templateUrl: './show-list-notifications.page.html',
  styleUrls: ['./show-list-notifications.page.scss'],
})
export class ShowListNotificationsPage implements OnInit {

    constructor(
      private modalCtrl: ModalController
  ) { }

  ngOnInit() {
  }

  closeModal(): void {
    this.modalCtrl.dismiss();
}

onRedireccion(){
  this.closeModal();
}

}
