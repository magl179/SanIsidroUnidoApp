import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ModalController } from '@ionic/angular';
import { EditProfilePage } from 'src/app/modals/edit-profile/edit-profile.page';
import { ChangePasswordPage } from 'src/app/modals/change-password/change-password.page';
import { RequestMembershipPage } from 'src/app/modals/request-membership/request-membership.page';
import { ChangeProfileImagePage } from 'src/app/modals/change-profile-image/change-profile-image.page';
import { NotificationsService } from 'src/app/services/notifications.service';
import { IRespuestaApiSIU, ITokenDecoded, IRespuestaApiSIUSingle, IDeviceUser } from "src/app//interfaces/models";
import { UserService } from 'src/app/services/user.service';
import { UtilsService } from 'src/app/services/utils.service';
import { getUserDevice } from 'src/app/helpers/user-helper';
import { finalize, map } from 'rxjs/operators';
import { getImageURL, mapUser } from 'src/app/helpers/utils';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'app-user',
    templateUrl: './user.page.html',
    styleUrls: ['./user.page.scss'],
})
export class UserPage implements OnInit {

    sizeOptions = 4;
    AuthUser = null;
    UserDevices = [];
    UserSocialProfiles = [];
    CurrentUserDevice: IDeviceUser = {
        id: null,
        phone_id: null,
        user_id: null
    };
    statusUserProfilesRequest = {
        completed: false,
        success: false
    };
    userDevicesLoaded = false;
    userSocialProfilesLoaded = false;

    constructor(
        private authService: AuthService,
        private modalCtrl: ModalController,
        private userService: UserService,
        private utilsService: UtilsService,
        private notificationsService: NotificationsService
    ) {
    }

    getAvatar(image_name: string) {
        return getImageURL(image_name);
    }

    async ngOnInit() {
        this.authService.sessionAuthUser.pipe(
                map((token_decoded: any) => {
                    if (token_decoded && token_decoded.user) {
                        token_decoded.user = mapUser(token_decoded.user);
                    }
                    return token_decoded;
                }),    
        ).subscribe(async(token_decoded: ITokenDecoded) => {
            if (token_decoded && token_decoded.user) {
                this.AuthUser = token_decoded.user;
                this.getUserSocialProfiles();
                this.getUserDevices();
                this.notificationsService.getUserDevice().subscribe(userdevice => {
                    if(userdevice){
                        this.CurrentUserDevice = getUserDevice(this.UserDevices, userdevice);
                    }
                }, (err: HttpErrorResponse) => {
                    if (err.error instanceof Error) {
                        console.log("Client-side error", err);
                    } else {
                        console.log("Server-side error", err);
                    }
                });
            }
        });
     }

    getUserSocialProfiles(){
        this.userService.getSocialProfilesUser().pipe(
            finalize(() => {
                this.userSocialProfilesLoaded = true;
            })
        ).subscribe((res: IRespuestaApiSIU) => {
            if (res.data) {
                console.log('res social profiles', res.data);
                this.UserSocialProfiles = res.data;
                
            }
        }, (err: HttpErrorResponse) => {
            if (err.error instanceof Error) {
                console.log("Client-side error", err);
            } else {
                console.log("Server-side error", err);
            }
        });
    }

    getUserDevices() {
        this.userService.getDevicesUser().pipe(
            finalize(() => {
                this.userDevicesLoaded = true;
            })
        ).subscribe((res: IRespuestaApiSIU) => {
            if (res.data) {
                console.log('res devices', res.data);
                this.UserDevices = res.data;
                
            }
        }, (err: HttpErrorResponse) => {
            if (err.error instanceof Error) {
                console.log("Client-side error", err);
            } else {
                console.log("Server-side error", err);
            }
        });
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
        if (this.AuthUser && this.AuthUser.user) {
            this.notificationsService.registerUserDevice(this.AuthUser.user.id);
        }
    }

    //Funcion remover dispositivo asociado a un usuario en la API
    removeUserDevice(device_id: number) {
        this.userService.sendRequestDeleteUserDevice(device_id).subscribe(async (res: IRespuestaApiSIUSingle) => {
            this.getUserDevices();
            this.utilsService.showToast({message: 'Dispositivo eliminado Correctamente'});
        }, (err: HttpErrorResponse) => {
            this.utilsService.showToast({message: 'Ocurrio un error al desconectar el dispositivo'});
            if (err.error instanceof Error) {
                console.log("Client-side error", err);
            } else {
                console.log("Server-side error", err);
            }
        });
    }

    removeSocialProfileToUser(social_profile_id) {
        this.userService.sendRequestDeleteSocialProfile(social_profile_id).subscribe(async (res: IRespuestaApiSIUSingle) => {
            this.getUserSocialProfiles();
            this.utilsService.showToast({message: 'Perfil Social fue desconectado correctamente'});
        },(err: HttpErrorResponse) => {
            this.utilsService.showToast({message: 'El Perfil Social no se pudo desconectar'});
            if (err.error instanceof Error) {
                console.log("Client-side error", err);
            } else {
                console.log("Server-side error", err);
            }
        });
    }

}