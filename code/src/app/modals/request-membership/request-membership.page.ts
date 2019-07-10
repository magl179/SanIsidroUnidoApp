import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
    selector: 'app-request-membership',
    templateUrl: './request-membership.page.html',
    styleUrls: ['./request-membership.page.scss'],
})
export class RequestMembershipPage implements OnInit {

    publicServiceImg = [];

    constructor(
        private modalCtrl: ModalController
    ) { }

    ngOnInit() {
    }

    closeModal() {
        this.modalCtrl.dismiss();
    }

    getUploadedImages(event) {
        console.log(event);
        this.publicServiceImg = event.total_img;
    }

    deleteImage(pos) {
        this.publicServiceImg.splice(pos, 1);
    }

    sendRequestMembership() {
        alert(JSON.stringify(this.publicServiceImg));
    }

}
