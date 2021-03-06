import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';
import { decodeToken } from 'src/app/helpers/auth-helper';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorService } from 'src/app/services/error.service';
import { MessagesService } from 'src/app/services/messages.service';
import { finalize } from 'rxjs/operators';
import { UtilsService } from 'src/app/services/utils.service';
import { UploadImageComponent } from 'src/app/components/upload-image/upload-image.component';
import { IUploadedImages } from 'src/app/interfaces/models';

@Component({
    selector: 'app-change-profile-image',
    templateUrl: './change-profile-image.page.html',
    styleUrls: ['./change-profile-image.page.scss'],
})
export class ChangeProfileImagePage implements OnInit {
    
    @ViewChild(UploadImageComponent) uploadImageComponent: UploadImageComponent;
    profileUserImg: string[] = [];
    sending = false;

    constructor(
        private modalCtrl: ModalController,
        private userService: UserService,
        private utilsService: UtilsService,
        private authService: AuthService,
        private errorService: ErrorService,
        private messageService: MessagesService,
    ) { }

    ngOnInit() {
    }

    closeModal() {
        this.modalCtrl.dismiss();
    }

    getUploadedImages(event: IUploadedImages) {
        this.profileUserImg = event.uploaded_images;
       
    }

    seeImageDetail(url: string) {
        this.utilsService.seeImageDetail(url, '');
    }

    sendRequestChangeUserProfile() {
        this.sending = true;
        this.messageService.showInfo('Enviando...');
        this.userService.sendChangeUserImageRequest(this.profileUserImg[0])
        .pipe(
            finalize(() => this.sending = false)
        )
        .subscribe(async res => {
            const token = res.data.token;
            const token_decoded = decodeToken(token);
            this.authService.saveUserInfo(token, token_decoded);
            this.authService.saveLocalStorageInfo(token, token_decoded);
            this.messageService.showSuccess('Imagen Actualizada Correctamente');
            this.closeModal();
        },(error_http: HttpErrorResponse) => {
            this.errorService.manageHttpError(error_http, 'Imagen no ha podido ser actualizada');
        });
    }

    deleteImage(index: number) {
        this.profileUserImg.splice(index, 1);
        this.uploadImageComponent.deleteImage(index);
    }

}
