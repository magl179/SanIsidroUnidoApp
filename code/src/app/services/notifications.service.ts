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
import { IPhoneUser} from 'src/app/interfaces/models';
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


    messagesList: OSNotificationPayload[] = [];
    currentUser = null;
    userDeviceID = new BehaviorSubject<string>(null);
    //userDeviceModel = new BehaviorSubject<string>(null);
    //userDevicePlatform = new BehaviorSubject<string>(null);
    pushListener = new EventEmitter<OSNotificationPayload>();
    AuthUser = null;
    /*userDeviceDefault = {
        phoneUUID: '',
        phoneModel: '',
        phonePlatform: ''
    };*/
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
        this.loadMessages();
        this.loadUser();
    }

    async initialConfig() {
        if (this.platform.is('cordova')) {
            console.log('Configurando OneSignal con San Isidro Unido App');
            const OneSignalID = environment.onesignal_id;
            const firebaseID = environment.firebase_app_id;
             console.log('Antes Onesignal StartInit');
            this.oneSignal.startInit(OneSignalID, firebaseID);
            console.log('Antes Onesignal In Focus Displaying');
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
            
            console.log('Antes Onesignal Endinit');
            this.oneSignal.endInit();
            console.log('Antes GET ONESIGNAL SUBSCRIPTOR');
            this.getOneSignalIDSubscriptor();
        } else {
            console.log('Onesignal sin Cordova Disponible');
        }
    }

    // GET UNIQUE ID SUSCRIPTOR
    getIDSubscriptor() {
        return this.userDeviceID.asObservable();
    }

    getUserDevice(){
        return this.userDevice.asObservable();
    }

     //Obtener Roles Usuario
    getUserDevices() {
        return this.AuthUser.value.user.devices.map(device => device.device_id);
    }

    hasDevices(){
        if(this.AuthUser && this.userDeviceID.value && this.AuthUser.devices && this.AuthUser.devices.length > 0){
             let hasDevice = false;
            // console.log('USER', this.authUser.value);
            //if (this.isAuthenticated()) {
                let userDevices = this.getUserDevices();
                for (const oneDevice of userDevices) {
                    if (userDevices.includes(this.userDeviceID.value)) {
                        hasDevice = true;
                    }
                }
            //}
            return hasDevice;
        }else{
            return false;
        }
    }

    loadUser() {
        this.authService.getAuthUser().subscribe(res => {
            console.log('Noti res user', res);
            if (res) {
                this.AuthUser = res.user;
            }
        });
    }

    async registrarDispositivoUsuarioApi() {
        await this.userService.sendRequestAddUserDevice(this.userDevice.value).subscribe(
            res => {
                console.log('Dispositivo Añadido Correctamente');
                this.utilsService.showToast('Dispositivo Añadido Correctamente');
            }, err => {
                this.utilsService.showToast('Ocurrio un error al añadir el dispositivo');
                console.log('Ocurrio un error al añadir el dispositivo', err);
            }
        );
    }

    // Función Obtener ID Suscriptor
    async getOneSignalIDSubscriptor() {
        console.log('INITIAL FUNCTION GET ONESIGNAL ID SUBSCRIPTOR: ');
        this.oneSignal.provideUserConsent(true);
        const deviceID = await this.oneSignal.getIds();
        this.userDeviceID.next(deviceID.userId);
        const userDevice: IPhoneUser = USER_DEVICE_DEFAULT;
        userDevice.phone_id = deviceID.userId; 
        userDevice.phone_model = this.device.model; 
        userDevice.phone_platform = this.device.platform;
        userDevice.description = `${this.device.platform} ${this.device.model}`
        this.userDevice.next(userDevice); 
        /* phoneUUID: '',
        phoneModel: '',
            phonePlatform: ''*/
        console.log('DEVICE SUBSCRIPTOR: ', deviceID);
        console.log('USERDEVICE', this.userDevice.value);
        // this.authService.getAuthUser().subscribe(user => {
            //if (this.AuthUser) {
             //   this.registrarDispositivoUsuarioApi();
            //}
        // });
       
        // this.
        // this.oneSignal.getIds().then( res=> {
        //     console.log(res.userId) . //===>ESTE ES TU ID
        //     this.userId.next(res.userId);
        // console.log('DEVICE SUBSCRIPTOR: ', res);
        // console.log('ID SUBSCRIPTOR: ', res.userId);
        // });
        // this.userId.next(deviceID.userId);
        console.log('END FUNCTION GET ONESIGNAL ID SUBSCRIPTOR: ');
    }

    // Función Cargar Mensajes
    async loadMessages() {
        this.messagesList = await this.storage.get('app_notifications') || [];
        return this.messagesList;
    }

    // Función para guardar los mensajes
    saveMessages() {
        this.storage.set('app_notifications', this.messagesList);
        console.log({ mensajesGuardados: this.messagesList });
    }

    // Función a Ejecutar cuando se recibe una notificación
    async manageNotificationReceived(appNotification: OSNotification) {
        await this.loadMessages();
        const notificationPayload = appNotification.payload;
        const pushNotificationExist = this.messagesList.find((message) => {
            return message.notificationID === notificationPayload.notificationID;
        });
        if (pushNotificationExist) {
            return;
        }
        this.messagesList.unshift(notificationPayload);
        await this.saveMessages();
        this.pushListener.emit(notificationPayload);
    }

    getNotifications(): Observable<any> {
        return this.http.get('assets/data/noti_test.json');
    }
}
