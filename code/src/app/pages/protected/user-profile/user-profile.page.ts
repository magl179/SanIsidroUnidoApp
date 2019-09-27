import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ModalController } from '@ionic/angular';
import { EditProfilePage } from 'src/app/modals/edit-profile/edit-profile.page';
import { ChangePasswordPage } from 'src/app/modals/change-password/change-password.page';
import { RequestMembershipPage } from 'src/app/modals/request-membership/request-membership.page';
import { ChangeProfileImagePage } from 'src/app/modals/change-profile-image/change-profile-image.page';
import { NotificationsService } from 'src/app/services/notifications.service';
import { IPhoneUser, IRespuestaApiSIU, ITokenDecoded, IRespuestaApiSIUSingle } from '../../../interfaces/models';
import { NetworkService } from 'src/app/services/network.service';
import { UserService } from '../../../services/user.service';
import { UtilsService } from '../../../services/utils.service';
import { environment } from '../../../../environments/environment';

const URL_PATTERN = new RegExp(/^(http[s]?:\/\/){0,1}(w{3,3}\.)[-a-z0-9+&@#\/%?=~_|!:,.;]*[-a-z0-9+&@#\/%=~_|]/);

@Component({
    selector: 'app-user-profile',
    templateUrl: './user-profile.page.html',
    styleUrls: ['./user-profile.page.scss'],
})
export class UserProfilePage implements OnInit {

    //Guardar Subscripcion Usuario
    // appNetworkConnection = false;
    // imageServeURL = `${environment.apiBaseURL}/${environment.image_blob_url}/`;
    AuthUser = null;
    authUserRol = null;
    sizeOptions = 4;
    canRequestAfiliation = true;
    DeviceUser: IPhoneUser = null;
    UserDevices = null;

    constructor(
        private authService: AuthService,
        private modalCtrl: ModalController,
        private userService: UserService,
        private utilsService: UtilsService,
        private notificationsService: NotificationsService
    ) {
    }

    getImageURL(image_name) {
        const imgIsURL = URL_PATTERN.test(image_name);
        if (imgIsURL) {
            return image_name;
        } else {
            return `${environment.apiBaseURL}/${environment.image_assets}/${image_name}`;
        }
    }

    async ngOnInit() {
        this.authService.getAuthUser().subscribe((token_decoded: ITokenDecoded) => {
            console.log('token decoded', token_decoded)
            console.log('token decoded VERIFY', (token_decoded.user) ? 'true' : 'false');
            if (token_decoded.user) {
                this.AuthUser = token_decoded.user;
                console.log(this.AuthUser);
                this.getRoles();
            }
        });
        this.notificationsService.getUserDevice().subscribe(userdevice => {
            if(userdevice){
                this.DeviceUser = userdevice;
            }
        });
     }

    getRoles() {
        if (this.AuthUser && this.AuthUser.roles) {
            const roles = this.AuthUser.roles.map(role => role.slug);
            const rol = roles.find(rol => environment.roles_permitidos.includes(rol));
            if (rol) {
                // console.log('roles', rol);
                this.authUserRol = rol;
            }
        }
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

    removeDevicetoUser(device_id: number) {
        this.notificationsService.removeUserDevice(device_id);
    }

    removeSocialProfileToUser(social_profile_id) {
        this.userService.sendRequestDeleteSocialProfile(social_profile_id).subscribe(async (res: IRespuestaApiSIUSingle) => {
            const token = res.data.token;
            this.authService.updateFullAuthInfo(token);
            this.utilsService.showToast('Perfil Social fue desconectado correctamente');
        }, (err: any) => {
            this.utilsService.showToast('El Perfil Social no se pudo desconectar');
            console.log('error al desconectar perfil social imagen usuario', err);
        });
    }

}
