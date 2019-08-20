import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';
import { UtilsService } from 'src/app/services/utils.service';

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
        this.userService.sendRequestUserMembership(this.publicServiceImg[0]).subscribe((res: any) => {
            this.utilsService.showToast('Solicitud Enviada Correctamente');
            this.authService.updateAuthInfo(res.data.token, res.data.user)
        }, err => {
            this.utilsService.showToast('Solicitud no se pudo enviar :(');
            console.log('error al solicitar afiliacion datos usuario', err);
        });
    }

}
