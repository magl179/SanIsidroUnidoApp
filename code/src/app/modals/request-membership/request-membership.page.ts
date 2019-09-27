import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';
import { UtilsService } from 'src/app/services/utils.service';
import { IRespuestaApiSIUSingle } from "../../interfaces/models";

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
        alert(JSON.stringify(this.publicServiceImg));
        this.userService.sendRequestUserMembership(this.publicServiceImg[0]).subscribe(async (res: IRespuestaApiSIUSingle) => {
            const token = res.data.token;
            this.authService.updateFullAuthInfo(token);
            this.utilsService.showToast('Solicitud Enviada Correctamente');
        }, (err: any) => {
            this.utilsService.showToast('La solicitud no ha podido ser enviada');
            console.log('error al solicitar afiliacion datos usuario', err);
        });
    }

}
