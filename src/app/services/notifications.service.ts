import { Injectable, EventEmitter, OnInit } from '@angular/core';
import { OneSignal, OSNotification, OSNotificationPayload } from '@ionic-native/onesignal/ngx';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { Platform } from '@ionic/angular';
import { UserService } from './user.service';
import { AuthService } from './auth.service';
import { IDeviceUser, INotiList } from 'src/app/interfaces/models';
import { Device } from '@ionic-native/device/ngx';
import { CONFIG } from 'src/config/config';
import { MessagesService } from './messages.service';
import { ErrorService } from './error.service';
import { Storage } from '@ionic/storage'
import { Router } from '@angular/router';
import { EventsService } from './events.service';
import { HttpErrorResponse } from '@angular/common/http';

const USER_DEVICE_ID_STORAGE = "siuDevice";

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
export class NotificationsService implements OnInit {

    onesignalSubscription = true;
    currentUser = null;
    pushListener = new EventEmitter<OSNotificationPayload>();
    AuthUser = null;
    userDevice = new BehaviorSubject<IDeviceUser>(USER_DEVICE_DEFAULT);

    constructor(
        private device: Device,
        private oneSignal: OneSignal,
        private platform: Platform,
        private errorService: ErrorService,
        private messageService: MessagesService,
        private userService: UserService,
        private authService: AuthService,
        private storage: Storage,
        private router: Router,
        private events_appService: EventsService
    ) {
        this.loadUser();
    }

    ngOnInit() {
    }

    async initialConfig() {
        this.events_appService.logoutAppEmitter.subscribe((event: any) => {
            this.logoutOnesignal();
        });
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
                this.manageNotificationReceived(myNotification);
            });
            //Funcion para hacer algo cuando una notificacion es recibida
            this.oneSignal.handleNotificationOpened().subscribe(async (myNotification) => {
                await this.manageNotificationOpened(myNotification.notification);
            });           
            //Función acabar la configuración de Onesignal
            this.oneSignal.endInit();
            // Obtener el ID De Subscriptor de este dispositivo
            this.getOneSignalIDSubscriptor();
        }
    }
    
    //Guardar ID Dispositivo en el Storage
    async saveDeviceInfo(device_id: any) {
        this.storage.set(USER_DEVICE_ID_STORAGE, device_id);
    }
    //Obtener ID Dispositivo en el Storage
    async getUserDeviceInfo() {
        const getUserDeviceID = new Promise((resolve, reject) => {
            this.storage.get(USER_DEVICE_ID_STORAGE).then(user_device => {
                resolve(user_device);
            });
        });
        return await getUserDeviceID;
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
                    this.saveDeviceInfo(this.userDevice.value.phone_id);
                }, (error_http: HttpErrorResponse) => {
                    this.errorService.manageHttpError(error_http, 'No pudimos agregar el dispositivo', false);
                });
        }
    }

    activateOnesignalSubscription() {
        //Activar notificaciones
        if (this.platform.is('cordova')) {
            this.oneSignal.setSubscription(true);
        }
    }
    deactivateOnesignalSubscription() {
        //Desactivar notificaciones
        if (this.platform.is('cordova')) {
            this.oneSignal.setSubscription(false);
        }
    }

    setEmailOnesignal(email: string){
        if (this.platform.is('cordova')) {
            this.oneSignal.setEmail(email);
        }
    }
    logOutEmailOnesignal(){
        if (this.platform.is('cordova')) {
            this.oneSignal.logoutEmail();
        }
    }

    toggleOnesignalSubscription(){
        this.onesignalSubscription = !this.onesignalSubscription;
        if(this.onesignalSubscription){
            this.messageService.showSuccess('Te has suscrito a las notificaciones :)');
        }else{
            this.messageService.showWarning('Te has desuscrito a las notificaciones :(');
        }
        this.oneSignal.setSubscription(this.onesignalSubscription);
    }

    async logoutOnesignal() {
        if (this.platform.is('cordova')) {
            const onesignalDevice = await this.oneSignal.getIds();
            const deviceID = onesignalDevice.userId;
        }
    }

    logoutDeviceApi(deviceID){
        if (deviceID) {
            this.userService.sendRequestDeleteUserPhoneDevice(deviceID).subscribe(async (res: any) => {
                this.messageService.showSuccess('Dispositivo Desuscrito Correctamente');
            }, (error_http: HttpErrorResponse) => {
                this.errorService.manageHttpError(error_http, 'Ocurrio un error al desuscribir el dispositivo');
            });
        }
    }


    // Función para Obtener ID de Suscriptor de Onesignal
    async getOneSignalIDSubscriptor() {
        //Pedir acceso a notificaciones, en caso de no tenerlas
        if(this.platform.is('cordova')){
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
            return userDevice;
        }else{
            return null;
        }
    }

    // Función a Ejecutar cuando se recibe una notificación
    async manageNotificationReceived(appNotification: OSNotification) {
    }

    async manageNotificationOpened(appNotification: OSNotification) {
        //Verificar si recibe data adicional
        const aditionalData = appNotification.payload.additionalData;
        await this.manageAppNotification(aditionalData);
    }

    async manageAppNotification(aditionalData: INotiList) {
        //Verificar si tengo dato posts   
        console.log('manage app notification', aditionalData)     
        this.managePostNotification(aditionalData);
        
    }
    async managePostNotification(aditionalDataPost: INotiList) {
        const post = aditionalDataPost.post;
        let urlNavigate = null;

        if (post && post.id && post.category) {
            //Switch de Opciones segun el slug del posts
            switch (post.category.slug.toLowerCase()) {
                case CONFIG.EMERGENCIES_SLUG: //caso posts emergencia creado
                    urlNavigate = `/emergencies/list/${post.id}`;
                    break;
                case CONFIG.EVENTS_SLUG: //caso posts evento creado
                    // urlNavigate = `/events/detail/${post.id}`;
                    // break;
                    if (post.subcategory) {
                        urlNavigate = `/events/list/${post.subcategory.slug}/${post.id}`;
                    } else {
                        urlNavigate = `events/categories`;
                    }
                    break;
                case CONFIG.SOCIAL_PROBLEMS_SLUG: // caso posts problema social
                    if (post.subcategory) {
                        urlNavigate = `/social-problems/list/${post.subcategory.slug}/${post.id}`;
                    } else {
                        urlNavigate = `/social-problems/categories`;
                    }
                    break;
                case CONFIG.REPORTS_SLUG: //caso reporte o informe
                    urlNavigate = `/reports/list/${post.id}`;
                    break;
                default:
                    urlNavigate = null;
                    break;
            }
            if (urlNavigate) {
                setTimeout(() => {
                    this.router.navigateByUrl(urlNavigate);
                }, 1000);
            }
        }
    }
}
