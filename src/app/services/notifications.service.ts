import { Injectable, EventEmitter } from '@angular/core';
import { OneSignal, OSNotification, OSNotificationPayload } from '@ionic-native/onesignal/ngx';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { Platform, NavController } from '@ionic/angular';
import { UserService } from './user.service';
import { AuthService } from './auth.service';
import { UtilsService } from './utils.service';
import { IDeviceUser } from 'src/app/interfaces/models';
import { Device } from '@ionic-native/device/ngx';
import { INotiPostOpen } from "src/app/interfaces/models";
import { CONFIG } from 'src/config/config';
import { MessagesService } from './messages.service';
import { ErrorService } from './error.service';


const USER_DEVICE_DEFAULT: IDeviceUser = {
    id: null,
    user_id: null,
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
    userDevice = new BehaviorSubject<IDeviceUser>(USER_DEVICE_DEFAULT);

    constructor(
        private device: Device,
        private oneSignal: OneSignal,
        private platform: Platform,
        private errorService: ErrorService,
        private navCtrl: NavController,
        private messageService: MessagesService,
        private userService: UserService,
        private authService: AuthService,
        private utilsService: UtilsService
    ) {
        this.loadUser();
    }

    async initialConfig() {
        //Configurar Onesignal en un Dispositivo
        if (this.platform.is('cordova')) {
            //obtener el onesginal_id y el firebaseid
            const OneSignalID = environment.ONESIGNAL_ID;
            const firebaseID = environment.FIREBASE_APP_ID;
            // Inicializar Onesignal con esas credenciales
            this.oneSignal.startInit(OneSignalID, firebaseID);
            // Configurar tipo de notificaciones a mostrar, en este caso notificaciones push
            this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);
            //Funcion hacer algo cuando se recibe una notificación
            this.oneSignal.handleNotificationReceived().subscribe((myNotification) => {
                //console.log('Una notificación fue recibida', myNotification);
                this.manageNotificationReceived(myNotification);
            });
            //Funcion para hacer algo cuando una notificacion es recibida
            this.oneSignal.handleNotificationOpened().subscribe(async (myNotification) => {
                //console.log('Una notificación fue recibida y abierta', myNotification);
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
    registerUserDevice(user_id: number) {
        if (this.platform.is('cordova')) {
            const data: IDeviceUser = {
                user_id: user_id,
                id: null,
                description: this.userDevice.value.description,
                phone_id: this.userDevice.value.phone_id,
                phone_model: this.userDevice.value.phone_model,
                phone_platform: this.userDevice.value.phone_platform
            };
            this.userService.sendRequestAddUserDevice(data)
                .subscribe(async (res: any) => {
                    this.messageService.showSuccess('Dispositivo Añadido Correctamente');
                }, (err: any) => {
                    this.errorService.manageHttpError(err, 'Ocurrio un error al añadir el dispositivo');
                });
        }
    }


    // Función para Obtener ID de Suscriptor de Onesignal
    async getOneSignalIDSubscriptor() {
        //Pedir acceso a notificaciones, en caso de no tenerlas
        this.oneSignal.provideUserConsent(true);
        const deviceID = await this.oneSignal.getIds();
        const userDevice: IDeviceUser = {
            user_id: null,
            id: null,
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
        await this.manageAppNotification(aditionalData);
    }

    async manageAppNotification(aditionalData: any) {
         //Verificar si tengo dato posts
        if (aditionalData && aditionalData.post) {
            this.managePostNotification(aditionalData.post);
        }
    }
    async managePostNotification(aditionalDataPost: INotiPostOpen) {     
            const post = aditionalDataPost;
            if (post && post.category && post.id) {
                //Switch de Opciones segun el slug del posts
                console.warn('post catgory', post.category )
                switch (post.category) {
                    case CONFIG.EMERGENCIES_SLUG: //caso posts emergencia creado
                        this.navCtrl.navigateForward(`/emergencies/detail/${post.id}`);
                        break;
                    case CONFIG.EVENTS_SLUG: //caso posts evento creado
                        this.navCtrl.navigateForward(`/events/detail/${post.id}`);
                        break;
                    case CONFIG.SOCIAL_PROBLEMS_SLUG: // caso posts problema social
                        if (post.subcategory) {
                            this.navCtrl.navigateForward(`/social-problems/list/${post.subcategory}/${post.id}`);
                        } else {
                            this.navCtrl.navigateForward(`/social-problems/categories`);
                        }
                        break;
                    case CONFIG.REPORTS_SLUG: //caso reporte o informe
                        this.navCtrl.navigateForward(`/reports/detail/${post.id}`);
                        break;
                    default:
                        console.log('No match any noti')
                        return;
                }
            }
    }
}
