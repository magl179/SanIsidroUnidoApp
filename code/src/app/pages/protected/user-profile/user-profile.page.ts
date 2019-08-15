import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ModalController } from '@ionic/angular';
import { EditProfilePage } from 'src/app/modals/edit-profile/edit-profile.page';
import { ChangePasswordPage } from 'src/app/modals/change-password/change-password.page';
import { RequestMembershipPage } from 'src/app/modals/request-membership/request-membership.page';
import { ChangeProfileImagePage } from 'src/app/modals/change-profile-image/change-profile-image.page';


@Component({
    selector: 'app-user-profile',
    templateUrl: './user-profile.page.html',
    styleUrls: ['./user-profile.page.scss'],
})
export class UserProfilePage implements OnInit {

    userProfileSubscription;

    userApp = null;
    sizeOptions = 4;
    canRequestAfiliation = true;

    constructor(
        private authService: AuthService,
        private modalCtrl: ModalController) {
        // this.loadUserData();
    }

    ionViewWillEnter() {
        this.userProfileSubscription = this.authService.getUserSubject().subscribe(res => {
            if (res) {
                this.userApp = res.user;
            }
        });
    }

    ionViewWillLeave() {
        this.userProfileSubscription.unsubscribe();
    }

    async ngOnInit() {
        this.checkRolUser();
     }

    async checkRolUser() {
        this.sizeOptions = (this.canRequestAfiliation) ? 4 : 6;
    }
    async loadUserData() {
        await this.authService.getUserSubject().subscribe(res => {
            if (res) {
                this.userApp = res.user;
            }
        });
    }

    getRoles() {
        return this.userApp.roles.map(role => role.slug);
    }

    async showEditProfileModal() {
        const modal = await this.modalCtrl.create({
            component: EditProfilePage,
            componentProps: {}
        });
        await modal.present();
    }

    async showChangePassModal() {
        const modal = await this.modalCtrl.create({
            component: ChangePasswordPage,
            componentProps: {
                nombre: 'Stalin',
                pais: 'Ecuador'
            }
        });
        await modal.present();

        // const { data } = await modal.onDidDismiss();

        // if (data == null) {
        //     console.log('No hay datos que Retorne el Modal');
        // } else {
        //     console.log('Retorno de Datos del Modal: ', data);
        // }
    }

    async showRequestMembershipModal() {
        const modal = await this.modalCtrl.create({
            component: RequestMembershipPage,
            componentProps: {
                nombre: 'Stalin',
                pais: 'Ecuador'
            }
        });
        await modal.present();

        // const { data } = await modal.onDidDismiss();

        // if (data == null) {
        //     console.log('No hay datos que Retorne el Modal');
        // } else {
        //     console.log('Retorno de Datos del Modal: ', data);
        // }
    }

    async showChangeUserImageProfileModal() {
        const modal = await this.modalCtrl.create({
            component: ChangeProfileImagePage,
            componentProps: {
                nombre: 'Stalin',
                pais: 'Ecuador'
            }
        });
        await modal.present();

        // const { data } = await modal.onDidDismiss();

        // if (data == null) {
        //     console.log('No hay datos que Retorne el Modal');
        // } else {
        //     console.log('Retorno de Datos del Modal: ', data);
        // }
    }

}
