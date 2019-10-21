import { Injectable, EventEmitter } from '@angular/core';
import { OneSignal, OSNotification, OSNotificationPayload } from '@ionic-native/onesignal/ngx';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { Platform, NavController } from '@ionic/angular';
import { UserService } from './user.service';
import { AuthService } from './auth.service';
import { UtilsService } from './utils.service';
import { IPhoneUser } from 'src/app/interfaces/models';
import { Device } from '@ionic-native/device/ngx';
import { INotiPostOpen } from "src/app/interfaces/models";


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
        private platform: Platform,
        private navCtrl: NavController,
        private userService: UserService,
        private authService: AuthService,
        private utilsService: UtilsService
    ) {
        this.loadUser();
    }

    async initialConfig() {
        //Configurar Onesignal en un Dispositivo
        if (this.platform.is('cordova')) {
            // console.log('Configurando OneSignal con San Isidro Unido App');
            //obtener el onesginal_id y el firebaseid
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
                await this.manageNotificationOpened(myNotification.notification);
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
    //Carga la información del usuario autenticado
    loadUser() {
        this.authService.sessionAuthUser.subscribe(res => {
            if (res) {
                this.AuthUser = res.user;
            }
        });
    }
    //Registrar el dispositivo del usuario en la API
    registerUserDevice() {
        if (this.platform.is('cordova')) {
            const data: IPhoneUser = {
                description: this.userDevice.value.description,
                phone_id: this.userDevice.value.phone_id,
                phone_model: this.userDevice.value.phone_model,
                phone_platform: this.userDevice.value.phone_platform
            };
            this.userService.sendRequestAddUserDevice(data)
                .subscribe(async (res: any) => {
                    this.utilsService.showToast({message: 'Dispositivo Añadido Correctamente'});
                }, (err: any) => {
                    this.utilsService.showToast({message: 'Ocurrio un error al añadir el dispositivo'});
                    console.log('Ocurrio un error al añadir el dispositivo', err);
                });
        }
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

    async manageNotificationOpened(appNotification: OSNotification) {
        appNotification.payload.additionalData
        //Verificar si recibe data adicional
        const aditionalData = appNotification.payload.additionalData;
        await this.managePostNotification(aditionalData);
    }

    async managePostNotification(aditionalData: any) {
        if (aditionalData) {
            //Verificar si tengo dato posts
            const post: INotiPostOpen = aditionalData.post;
            if (post && post.type && post.id) {
                //Switch de Opciones segun el slug del posts
                switch (post.type) {
                    case environment.emergenciesSlug: //caso posts emergencia creado
                        await this.navCtrl.navigateForward(`/emergency-detail/${post.id}`);
                        break;
                    case environment.eventsSlug: //caso posts evento creado
                        await this.navCtrl.navigateForward(`/event-detail/${post.id}`);
                        break;
                    case environment.socialProblemSlug: // caso posts problema social
                        await this.navCtrl.navigateForward(`/social-problem-detail/${post.id}`);
                        break;
                    case environment.reportsSlug: //caso reporte o informe
                        await this.navCtrl.navigateForward(`/report-detail/${post.id}`);
                        break;
                    default:
                        return;
                }
            }
        }
    }
}
