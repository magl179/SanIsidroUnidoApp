import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
    selector: 'app-change-profile-image',
    templateUrl: './change-profile-image.page.html',
    styleUrls: ['./change-profile-image.page.scss'],
})
export class ChangeProfileImagePage implements OnInit {
    profileUserImg = [];

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
        this.profileUserImg = event.total_img;
    }

    sendRequestChangeUserProfile() {
        alert(JSON.stringify(this.profileUserImg));
    }

    deleteImage(pos) {
        this.profileUserImg.splice(pos, 1);
    }

}
