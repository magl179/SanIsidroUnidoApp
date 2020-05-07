import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ModalController } from '@ionic/angular';
import { EditProfilePage } from 'src/app/modals/edit-profile/edit-profile.page';
import { ChangePasswordPage } from 'src/app/modals/change-password/change-password.page';
import { ChangeProfileImagePage } from 'src/app/modals/change-profile-image/change-profile-image.page';
import { NotificationsService } from 'src/app/services/notifications.service';
import { IRespuestaApiSIU, ITokenDecoded, IRespuestaApiSIUSingle, IDeviceUser } from "src/app/interfaces/models";
import { UserService } from 'src/app/services/user.service';
import { UtilsService } from 'src/app/services/utils.service';
import { getUserDevice } from 'src/app/helpers/user-helper';
import { finalize, map } from 'rxjs/operators';
import { getImageURL, mapUser } from 'src/app/helpers/utils';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorService } from 'src/app/services/error.service';
import { MessagesService } from 'src/app/services/messages.service';

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
        private messageService: MessagesService,
        private errorService: ErrorService,
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
                    this.errorService.manageHttpError(err, 'Ocurrio un error al obtener tus dispositivos asociados');
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
                this.UserSocialProfiles = res.data;
                
            }
        }, (err: HttpErrorResponse) => {
            this.errorService.manageHttpError(err, 'Ocurrio un error al obtener tus perfiles sociales');
        });
    }

    getUserDevices() {
        this.userService.getDevicesUser().pipe(
            finalize(() => {
                this.userDevicesLoaded = true;
            })
        ).subscribe((res: IRespuestaApiSIU) => {
            if (res.data) {
                this.UserDevices = res.data;
                
            }
        }, (err: HttpErrorResponse) => {
            this.errorService.manageHttpError(err, 'Ocurrio un error al obtener la información de tus dispositivos');
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
            this.messageService.showSuccess("Dispositivo eliminado Correctamente");
        }, (err: HttpErrorResponse) => {
            this.errorService.manageHttpError(err, 'Ocurrio un error al desconectar el dispositivo');
        });
    }

    removeSocialProfileToUser(social_profile_id) {
        this.userService.sendRequestDeleteSocialProfile(social_profile_id).subscribe(async (res: IRespuestaApiSIUSingle) => {
            this.getUserSocialProfiles();
            this.messageService.showSuccess("El Perfil Social fue desconectado correctamente");
        },(err: HttpErrorResponse) => {
            this.errorService.manageHttpError(err, 'El Perfil Social no se pudo desconectar');
        });
    }

    seeProfileImageDetail(url: string, title = 'Imagen de Perfil'){
        this.utilsService.seeImageDetail(url, title);
    }

}
