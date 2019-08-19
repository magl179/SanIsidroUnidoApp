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


@Injectable({
    providedIn: 'root'
})
export class NotificationsService {

    messagesList: OSNotificationPayload[] = [];
    currentUser = null;
    userDeviceID = new BehaviorSubject<string>(null);
    pushListener = new EventEmitter<OSNotificationPayload>();
    AuthUser = null;

    constructor(
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

    loadUser() {
        this.authService.getAuthUser().subscribe(res => {
            this.AuthUser = res.user;
        });
    }

    registrarDispositivoUsuarioApi() {
        this.userService.sendRequestAddUserDevice(this.userDeviceID.value, 'Dispositivo Usuario').subscribe(
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
        console.log('DEVICE SUBSCRIPTOR: ', deviceID);
        console.log('ID SUBSCRIPTOR: ', deviceID.userId);
        // this.authService.getAuthUser().subscribe(user => {
            if (this.AuthUser) {
                this.registrarDispositivoUsuarioApi()
            }
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
