import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';
import { UtilsService } from 'src/app/services/utils.service';
import { IRespuestaApiSIUSingle } from "src/app/interfaces/models";
import { decodeToken } from 'src/app/helpers/auth-helper';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'app-request-membership',
    templateUrl: './request-membership.page.html',
    styleUrls: ['./request-membership.page.scss'],
})
export class RequestMembershipPage implements OnInit {

    publicServiceImg = [];

    constructor(
        private modalCtrl: ModalController,
        private userService: UserService,
        private authService: AuthService,
        private utilsService: UtilsService
    ) { }

    ngOnInit() {
    }

    closeModal():void {
        this.modalCtrl.dismiss();
    }

    getUploadedImages(event: any) {
        // console.log(event);
        this.publicServiceImg = event.total_img;
    }

    deleteImage(pos: number) {
        this.publicServiceImg.splice(pos, 1);
    }

    sendRequestMembership() {
        // alert(JSON.stringify(this.publicServiceImg));
        this.userService.sendRequestUserMembership(this.publicServiceImg[0]).subscribe(async (res: IRespuestaApiSIUSingle) => {
            const token = res.data.token;
            const token_decoded = decodeToken(token);
            this.authService.saveUserInfo(token, token_decoded);
            this.authService.saveLocalStorageInfo(token, token_decoded);
            this.utilsService.showToast('Solicitud Enviada Correctamente');
        },(err: HttpErrorResponse) => {
            if (err.error instanceof Error) {
                console.log("Client-side error", err);
            } else {
                console.log("Server-side error", err);
            }
            this.utilsService.showToast('La solicitud no ha podido ser enviada');
        });
    }

}
