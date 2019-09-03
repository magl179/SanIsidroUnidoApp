import { Injectable, EventEmitter } from '@angular/core';
import { OneSignal, OSNotification, OSNotificationPayload } from '@ionic-native/onesignal/ngx';
import { environment } from '../../environments/environment';
import { Storage } from '@ionic/storage';
import { BehaviorSubject } from 'rxjs';
import { Platform } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserService } from './user.service';
import { AuthService } from './auth.service';
import { UtilsService } from './utils.service';
import { IPhoneUser } from 'src/app/interfaces/models';
import { Device } from '@ionic-native/device/ngx';


const USER_DEVICE_DEFAULT: IPhoneUser = {
    phone_id: '',
    phone_model: '',
    phone_platform: ''
};


@Injectable({
    providedIn: 'root'
})
export class NotificationsService {


    // messagesList: OSNotificationPayload[] = [];
    currentUser = null;
    pushListener = new EventEmitter<OSNotificationPayload>();
    AuthUser = null;
    userDevice = new BehaviorSubject<IPhoneUser>(USER_DEVICE_DEFAULT);

    constructor(
        private device: Device,
        private oneSignal: OneSignal,
        private storage: Storage,
        private platform: Platform,
        private http: HttpClient,
        private userService: UserService,
        private authService: AuthService,
        private utilsService: UtilsService
    ) {
        this.loadUser();
        // this.loadUserDevices();
    }

    async initialConfig() {
        if (this.platform.is('cordova')) {
            console.log('Configurando OneSignal con San Isidro Unido App');
            const OneSignalID = environment.onesignal_id;
            const firebaseID = environment.firebase_app_id;
            // console.log('Antes Onesignal StartInit');
            this.oneSignal.startInit(OneSignalID, firebaseID);
            // console.log('Antes Onesignal In Focus Displaying');
            this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);

            this.oneSignal.handleNotificationReceived().subscribe((myNotification) => {
                // do something when notification is received
                console.log('Una notificación fue recibida', myNotification);
                this.manageNotificationReceived(myNotification);
            });

            this.oneSignal.handleNotificationOpened().subscribe(async (myNotification) => {
                // do something when a notification is opened
                console.log('Una notificación fue recibida y abierta', myNotification);
                await this.manageNotificationReceived(myNotification.notification);
            });

            // console.log/('Antes Onesignal Endinit');
            this.oneSignal.endInit();
            // console.log('Antes GET ONESIGNAL SUBSCRIPTOR');
            this.getOneSignalIDSubscriptor();
        } else {
            console.log('Onesignal sin Cordova');
        }
    }

    // GET UNIQUE ID SUSCRIPTOR
    // getIDSubscriptor() {
    // return this.userDeviceID.asObservable();
    // }

    getUserDevice() {
        return this.userDevice.asObservable();
    }

    //Obtener Roles Usuario
    getUserDevices() {
        if (this.AuthUser.value.user) {
            if (this.AuthUser.value.user.devices) {
                return this.AuthUser.value.user.devices.map(device => device.phone_id);
            } else{
                return [];
            }
        } else{
            return [];
        }
        
        // return this.userDevices.map(device => device.phone_id);
    }

    hasDevices() {
        if (this.AuthUser && this.userDevice.value.phone_id) {
            let userDevices = this.getUserDevices();
            let hasDevice = (userDevices.includes(this.userDevice.value.phone_id)) ? true : false;
            return hasDevice;
        } else {
            return false;
        }
    }

    loadUser() {
        this.authService.getAuthUser().subscribe(res => {
            if (res) {
                this.AuthUser = res.user;
            }
        });
    }

    async registerUserDevice() {
        if (this.platform.is('cordova')) {
            const data = {
                description: this.userDevice.value.description,
                phone_id: this.userDevice.value.phone_id,
                phone_model: this.userDevice.value.phone_model,
                phone_platform: this.userDevice.value.phone_platform
            };
            await this.userService.sendRequestAddUserDevice(data)
                .subscribe(async (res: any) => {
                    this.utilsService.showToast('Dispositivo Añadido Correctamente');
                    const token_decode = await this.authService.decodeToken(res.data.token);
                    this.authService.updateAuthInfo(res.data.token, token_decode);
                }, err => {
                    this.utilsService.showToast('Ocurrio un error al añadir el dispositivo :( ');
                    console.log('Ocurrio un error al añadir el dispositivo', err);
                });
        } else {
            console.log('No hay cordova RDU');
        }
    }

    async removeUserDevice(device_id) {
        await this.userService.sendRequestDeleteUserDevice(device_id).subscribe(async (res: any) => {
            await this.utilsService.showToast('Dispositivo eliminado Correctamente');
            const token_decode = await this.authService.decodeToken(res.data.token);
            this.authService.updateAuthInfo(res.data.token, token_decode);
        }, err => {
            this.utilsService.showToast('Ocurrio un error al desconectar el dispositivo :( ');
            console.log('Ocurrio un error al eliminar el dispositivo', err);
        });
    }

    // Función Obtener ID Suscriptor
    async getOneSignalIDSubscriptor() {
        console.log('INITIAL FUNCTION GET ONESIGNAL ID SUBSCRIPTOR: ');
        this.oneSignal.provideUserConsent(true);
        const deviceID = await this.oneSignal.getIds();

        const userDevice: IPhoneUser = {
            phone_id: deviceID.userId,
            phone_model: this.device.model || 'Modelo Generico',
            phone_platform: this.device.platform || 'Sistema Generico',
            description: `${this.device.platform} ${this.device.model}`
        };

        this.userDevice.next(userDevice);

        console.log('DEVICE SUBSCRIPTOR: ', deviceID);
        console.log('USERDEVICE', this.userDevice.value);
        console.log('END FUNCTION GET ONESIGNAL ID SUBSCRIPTOR: ');
    }

    // Función Cargar Mensajes
    // async loadMessages() {
    //     this.messagesList = await this.storage.get('app_notifications') || [];
    //     return this.messagesList;
    // }

    // Función para guardar los mensajes
    // saveMessages() {
    //     this.storage.set('app_notifications', this.messagesList);
    //     console.log({ mensajesGuardados: this.messagesList });
    // }

    // Función a Ejecutar cuando se recibe una notificación
    async manageNotificationReceived(appNotification: OSNotification) {
        // await this.loadMessages();
        // const notificationPayload = appNotification.payload;
        // const pushNotificationExist = this.messagesList.find((message) => {
        //     return message.notificationID === notificationPayload.notificationID;
        // });
        // if (pushNotificationExist) {
        //     return;
        // }
        // this.messagesList.unshift(notificationPayload);
        // await this.saveMessages();
        // this.pushListener.emit(notificationPayload);
    }

    getNotifications(): Observable<any> {
        return this.http.get('assets/data/noti_test.json');
    }
}
