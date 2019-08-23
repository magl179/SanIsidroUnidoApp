import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UserService } from '../../services/user.service';
import { UtilsService } from '../../services/utils.service';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-change-profile-image',
    templateUrl: './change-profile-image.page.html',
    styleUrls: ['./change-profile-image.page.scss'],
})
export class ChangeProfileImagePage implements OnInit {
    profileUserImg = [];

    constructor(
        private modalCtrl: ModalController,
        private userService: UserService,
        private utilsService: UtilsService,
        private authService: AuthService
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
        // alert(JSON.stringify(this.profileUserImg));
        this.userService.sendChangeUserImageRequest(this.profileUserImg[0]).subscribe(res => {
            this.utilsService.showToast('Imagen Actualizada Correctamente');
            this.authService.updateAuthInfo(res.data.token, res.data.user)
        }, err => {
            this.utilsService.showToast('Imagen No se pudo actualizar :(');
            console.log('error al actualizar imagen usuario', err);
        });
    }

    deleteImage(pos) {
        this.profileUserImg.splice(pos, 1);
    }

}
