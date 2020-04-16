import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
    selector: 'modal-edit-profile',
    templateUrl: './form-attend-emergency.page.html',
    styleUrls: ['./form-attend-emergency.page.scss'],
})
export class FormAttendEmergencyModal implements OnInit {

    constructor(
        private modalCtrl: ModalController,
    ){

    }

    ngOnInit(){

    }

    closeModal() {
        this.modalCtrl.dismiss();
    }
}