import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UserService } from 'src/app/services/user.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AuthService } from 'src/app/services/auth.service';
import { decodeToken } from 'src/app/helpers/auth-helper';
import { HttpErrorResponse } from '@angular/common/http';

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

    getUploadedImages(event: any) {
        console.log(event);
        this.profileUserImg = event.total_img;
    }

    sendRequestChangeUserProfile() {
        this.userService.sendChangeUserImageRequest(this.profileUserImg[0]).subscribe(async res => {
            const token = res.data.token;
            const token_decoded = decodeToken(token);
            this.authService.saveUserInfo(token, token_decoded);
            this.authService.saveLocalStorageInfo(token, token_decoded);
            this.utilsService.showToast('Imagen Actualizada Correctamente');
        },(err: HttpErrorResponse) => {
            if (err.error instanceof Error) {
                console.log("Client-side error", err);
            } else {
                console.log("Server-side error", err);
            }
            this.utilsService.showToast('Imagen no ha podido ser actualizada');
        });
    }

    deleteImage(pos: number) {
        this.profileUserImg.splice(pos, 1);
    }

}
