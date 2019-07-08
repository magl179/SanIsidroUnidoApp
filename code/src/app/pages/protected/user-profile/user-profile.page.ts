import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ModalController } from '@ionic/angular';
import { EditProfilePage } from 'src/app/modals/edit-profile/edit-profile.page';
import { ChangePasswordPage } from 'src/app/modals/change-password/change-password.page';
import { RequestMembershipPage } from 'src/app/modals/request-membership/request-membership.page';


@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss'],
})
export class UserProfilePage implements OnInit {

    userApp = null;

    constructor(
        private authService: AuthService,
        private modalCtrl: ModalController) {
        this.loadUserData();
   }

    async ngOnInit() { }
    
    async loadUserData() {
        await this.authService.user.subscribe(user => {
            if (user) {
                this.userApp = user;
            }
        });
    }

    async showProfileEditModal() {
        const modal = await this.modalCtrl.create({
            component: EditProfilePage,
            componentProps: {
                nombre: 'Stalin',
                pais: 'Ecuador'
            }
        });
        await modal.present();

        const { data } = await modal.onDidDismiss();

        if (data == null) {
            console.log('No hay datos que Retorne el Modal');
        } else {
            console.log('Retorno de Datos del Modal: ', data);
        }
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

        const { data } = await modal.onDidDismiss();

        if (data == null) {
            console.log('No hay datos que Retorne el Modal');
        } else {
            console.log('Retorno de Datos del Modal: ', data);
        }
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

        const { data } = await modal.onDidDismiss();

        if (data == null) {
            console.log('No hay datos que Retorne el Modal');
        } else {
            console.log('Retorno de Datos del Modal: ', data);
        }
    }

}
