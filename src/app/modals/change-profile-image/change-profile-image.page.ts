import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';
import { decodeToken } from 'src/app/helpers/auth-helper';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorService } from 'src/app/services/error.service';
import { MessagesService } from 'src/app/services/messages.service';

@Component({
    selector: 'app-change-profile-image',
    templateUrl: './change-profile-image.page.html',
    styleUrls: ['./change-profile-image.page.scss'],
})
export class ChangeProfileImagePage implements OnInit {
    
    profileUserImg: any[] = [];
    formSended = false;

    constructor(
        private modalCtrl: ModalController,
        private userService: UserService,
        private authService: AuthService,
        private errorService: ErrorService,
        private messageService: MessagesService,
    ) { }

    ngOnInit() {
    }

    closeModal() {
        this.modalCtrl.dismiss();
    }

    getUploadedImages(event: any) {
        this.profileUserImg = event.total_img;
    }

    sendRequestChangeUserProfile() {
        this.userService.sendChangeUserImageRequest(this.profileUserImg[0]).subscribe(async res => {
            const token = res.data.token;
            const token_decoded = decodeToken(token);
            this.authService.saveUserInfo(token, token_decoded);
            this.authService.saveLocalStorageInfo(token, token_decoded);
            this.messageService.showSuccess('Imagen Actualizada Correctamente');
            this.formSended = true;
            setTimeout(()=>{
                this.closeModal();
            }, 500);
        },(err: HttpErrorResponse) => {
            this.errorService.manageHttpError(err, 'Imagen no ha podido ser actualizada');
        });
    }

    deleteImage(pos: number) {
        this.profileUserImg.splice(pos, 1);
    }

}
