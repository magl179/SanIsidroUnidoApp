import { Injectable, EventEmitter } from '@angular/core';
import { OneSignal, OSNotification, OSNotificationPayload } from '@ionic-native/onesignal/ngx';
import { environment } from '../../environments/environment';
import { Storage } from '@ionic/storage';
import { Subject } from 'rxjs';
import { Platform } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class NotificationsService {

    messagesList: OSNotificationPayload[] = [];
    userId = new Subject<string>();
    pushListener = new EventEmitter<OSNotificationPayload>();

    constructor(
        private oneSignal: OneSignal,
        private storage: Storage,
        private platform: Platform,
        private http: HttpClient
    ) {
        this.loadMessages();
    }

    initialConfig() {
        if (this.platform.is('cordova')) {
            console.log('Configurando OneSignal con San Isidro Unido App');
            const OneSignalID = environment.onesignal_id;
            const firebaseID = environment.firebase_app_id;
            this.oneSignal.startInit(OneSignalID, firebaseID);
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
            this.getOneSignalIDSubscriptor();
            this.oneSignal.endInit();
        } else {
            console.log('Cordova no está disponible para usar OneSignal en Android');
        }
    }

    // GET UNIQUE ID SUSCRIPTOR
    getIDSubscriptor() {
        return this.userId.asObservable();
    }

    // Función Obtener ID Suscriptor
    async getOneSignalIDSubscriptor() {
        const deviceID = await this.oneSignal.getIds();
        this.userId.next(deviceID.userId);
    }

    // Función Cargar Mensajes  
    async  loadMessages() {
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
