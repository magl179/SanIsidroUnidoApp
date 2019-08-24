import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ModalController } from '@ionic/angular';
import { EditProfilePage } from 'src/app/modals/edit-profile/edit-profile.page';
import { ChangePasswordPage } from 'src/app/modals/change-password/change-password.page';
import { RequestMembershipPage } from 'src/app/modals/request-membership/request-membership.page';
import { ChangeProfileImagePage } from 'src/app/modals/change-profile-image/change-profile-image.page';
import { NotificationsService } from 'src/app/services/notifications.service';
import { IPhoneUser } from '../../../interfaces/models';
import { NetworkService } from 'src/app/services/network.service';
import { environment } from '../../../../environments/environment';
import { UserService } from '../../../services/user.service';
import { UtilsService } from '../../../services/utils.service';

const URL_PATTERN = new RegExp(/^(http[s]?:\/\/){0,1}(w{3,3}\.)[-a-z0-9+&@#\/%?=~_|!:,.;]*[-a-z0-9+&@#\/%=~_|]/);

@Component({
    selector: 'app-user-profile',
    templateUrl: './user-profile.page.html',
    styleUrls: ['./user-profile.page.scss'],
})
export class UserProfilePage implements OnInit {

    //Guardar Subscripcion Usuario
    appNetworkConnection = false;
    // imageServeURL = `${environment.apiBaseURL}/${environment.image_blob_url}/`;
    AuthUser = null;
    sizeOptions = 4;
    canRequestAfiliation = true;
    DeviceUser: IPhoneUser = null;

    constructor(
        private authService: AuthService,
        private modalCtrl: ModalController,
        private userService: UserService,
        private utilsService: UtilsService,
        private notificationsService: NotificationsService,
        private networkService: NetworkService) {
        // this.loadUserData();
    }

    getImageURL(image_name) {
        const imgIsURL = URL_PATTERN.test(image_name);
        if (imgIsURL) {
            return image_name;
        } else {
            return `${environment.apiBaseURL}/${environment.image_blob_url}/${image_name}`;
        }
    }

    ionViewWillEnter() {
        this.authService.getAuthUser().subscribe(res => {
            if (res) {                
                this.AuthUser = res.user;
            }
        });
        this.notificationsService.getUserDevice().subscribe(userdevice => {
            if(userdevice){
                this.DeviceUser = userdevice;
            }
        });
    }

    // ionViewWillLeave() {
    //     this.userProfileSubscription.unsubscribe();
    // }

    async ngOnInit() {
        this.networkService.getNetworkStatus().subscribe((connected: boolean) => {
            this.appNetworkConnection = connected;
        });
        this.checkRolUser();
     }

    async checkRolUser() {
        this.sizeOptions = (this.canRequestAfiliation) ? 4 : 6;
    }
  

    getRoles() {
        //console.log('get roles', this.AuthUser);
        if (this.AuthUser) {
            return this.AuthUser.roles.map(role => role.slug);
        }
        return [];
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
    }

    addDeviceToUser() {
        this.notificationsService.registerUserDevice();
    }

    removeDevicetoUser($device_id) {
        this.notificationsService.removeUserDevice($device_id);
    }

    removeSocialProfileToUser($social_profile_id) {
        this.userService.sendRequestDeleteSocialProfile($social_profile_id).subscribe((res: any) => {
            this.utilsService.showToast('Perfil Social Desconectado Correctamente');
            this.authService.updateAuthInfo(res.data.token, res.data.user)
        }, err => {
            this.utilsService.showToast('Perfil Social no se pudo eliminar desconectar :(');
            console.log('error al desconectar perfil social imagen usuario', err);
        });
    }

}
