import { Injectable, EventEmitter } from '@angular/core';
import { OneSignal, OSNotification, OSNotificationPayload } from '@ionic-native/onesignal/ngx';
import { environment } from '../../environments/environment';
import { Storage } from '@ionic/storage';
import { BehaviorSubject } from 'rxjs';
import { Platform } from '@ionic/angular';
import { HttpClient, HttpRequest } from "@angular/common/http";
import { Observable } from 'rxjs';
import { UserService } from './user.service';
import { AuthService } from './auth.service';
import { UtilsService } from './utils.service';
import { IPhoneUser } from 'src/app/interfaces/models';
import { Device } from '@ionic-native/device/ngx';
import { HttpRequestService } from "./http-request.service";
import { IRespuestaApiSIU, IRespuestaApiSIUSingle } from "../interfaces/models";


const USER_DEVICE_DEFAULT: IPhoneUser = {
    phone_id: '',
    phone_model: '',
    phone_platform: ''
};


@Injectable({
    providedIn: 'root'
})
export class NotificationsService {

    currentUser = null;
    pushListener = new EventEmitter<OSNotificationPayload>();
    AuthUser = null;
    userDevice = new BehaviorSubject<IPhoneUser>(USER_DEVICE_DEFAULT);

    constructor(
        private device: Device,
        private oneSignal: OneSignal,
        private storage: Storage,
        private platform: Platform,
        // private http: HttpClient,
        // private HttpRequest: HttpRequestService,
        private userService: UserService,
        private authService: AuthService,
        private utilsService: UtilsService
    ) {
        this.loadUser();
        // this.loadUserDevices();
    }

    async initialConfig() {
        //Configurar Onesignal en un Dispositivo
        if (this.platform.is('cordova')) {
            // console.log('Configurando OneSignal con San Isidro Unido App');
            //obtener el onesginal id y el firebaseid
            const OneSignalID = environment.onesignal_id;
            const firebaseID = environment.firebase_app_id;
            // Inicializar Onesignal con esas credenciales
            this.oneSignal.startInit(OneSignalID, firebaseID);
            // Configurar tipo de notificaciones a mostrar, en este caso notificaciones push
            this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);
            //Funcion hacer algo cuando se recibe una notificación
            this.oneSignal.handleNotificationReceived().subscribe((myNotification) => {
                console.log('Una notificación fue recibida', myNotification);
                this.manageNotificationReceived(myNotification);
            });
            //Funcion para hacer algo cuando una notificacion es recibida
            this.oneSignal.handleNotificationOpened().subscribe(async (myNotification) => {
                console.log('Una notificación fue recibida y abierta', myNotification);
                await this.manageNotificationReceived(myNotification.notification);
            });
            //Función acabar la configuración de Onesignal
            this.oneSignal.endInit();
            // Obtener el ID De Subscriptor de este dispositivo
            this.getOneSignalIDSubscriptor();
        }
    }
    //Retornar la información del dispositivo del usuario como un observable
    getUserDevice() {
        return this.userDevice.asObservable();
    }
    //Obtener los Dispositivos del Usuario
    getUserDevices() {
        if (this.AuthUser.value.user) {
            if (this.AuthUser.value.user.devices) {
                return this.AuthUser.value.user.devices.map(device => device.phone_id);
            } else {
                return [];
            }
        } else {
            return [];
        }
    }
    //Verificar si un usuario tiene dispositivos asociados
    async hasDevices() {
        if (this.AuthUser && this.userDevice.value.phone_id) {
            let userDevices = this.getUserDevices();
            let hasDevice = (userDevices.includes(this.userDevice.value.phone_id)) ? true : false;
            return hasDevice;
        } else {
            return false;
        }
    }
    //Carga la información del usuario autenticado
    loadUser() {
        this.authService.getAuthUser().subscribe(res => {
            if (res) {
                this.AuthUser = res.user;
            }
        });
    }
    //Registrar el dispositivo del usuario en la API
    registerUserDevice() {
        if (this.platform.is('cordova')) {
            const data = {
                description: this.userDevice.value.description,
                phone_id: this.userDevice.value.phone_id,
                phone_model: this.userDevice.value.phone_model,
                phone_platform: this.userDevice.value.phone_platform
            };
            this.userService.sendRequestAddUserDevice(data)
                .subscribe(async (res: any) => {
                      const token = res.data.token;
                    this.authService.updateFullAuthInfo(token);
                    this.utilsService.showToast('Dispositivo Añadido Correctamente');
                }, (err: any) => {
                    this.utilsService.showToast('Ocurrio un error al añadir el dispositivo');
                    console.log('Ocurrio un error al añadir el dispositivo', err);
                });
        }
    }
    //Funcion remover dispositivo asociado a un usuario en la API
    removeUserDevice(device_id: number) {
        this.userService.sendRequestDeleteUserDevice(device_id).subscribe(async (res: IRespuestaApiSIUSingle) => {
            const token = res.data.token;
            this.authService.updateFullAuthInfo(token);
            await this.utilsService.showToast('Dispositivo eliminado Correctamente');
        }, err => {
            this.utilsService.showToast('Ocurrio un error al desconectar el dispositivo :( ');
            console.log('Ocurrio un error al eliminar el dispositivo', err);
        });
    }

    // Función para Obtener ID de Suscriptor de Onesignal
    async getOneSignalIDSubscriptor() {
        //Pedir acceso a notificaciones, en caso de no tenerlas
        this.oneSignal.provideUserConsent(true);
        const deviceID = await this.oneSignal.getIds();
        const userDevice: IPhoneUser = {
            phone_id: deviceID.userId,
            phone_model: this.device.model || 'Modelo Generico',
            phone_platform: this.device.platform || 'Sistema Generico',
            description: `${this.device.platform} ${this.device.model}`
        };
        this.userDevice.next(userDevice);
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
}
