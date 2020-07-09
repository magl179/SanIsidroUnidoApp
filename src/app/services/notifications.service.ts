import { Injectable, EventEmitter, OnInit } from '@angular/core';
import { OneSignal, OSNotification, OSNotificationPayload } from '@ionic-native/onesignal/ngx';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, of } from 'rxjs';
import { Platform, NavController } from '@ionic/angular';
import { UserService } from './user.service';
import { AuthService } from './auth.service';
import { IDeviceUser, ITokenDecoded, INotiList } from 'src/app/interfaces/models';
import { Device } from '@ionic-native/device/ngx';
import { CONFIG } from 'src/config/config';
import { MessagesService } from './messages.service';
import { ErrorService } from './error.service';
import { Storage } from '@ionic/storage'
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { closeModalsOpened } from '../helpers/utils';
import { getUserRoles, hasRoles } from '../helpers/user-helper';
import { PostsService } from './posts.service';
import { catchError, pluck } from 'rxjs/operators';
import { EventsService} from 'src/app/services/events.service';

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
        private postService: PostsService,
        private navCtrl: NavController,
        private eventsEmitterService: EventsService
    ) {
        this.loadUser();
        this.eventsEmitterService.logoutDevice.subscribe(async() =>{
            await this.logoutUserDevice();
        });
    }

    ngOnInit() {
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
    async saveDeviceInfo(device_id: string) {
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
                .subscribe(() => {
                    this.saveDeviceInfo(this.userDevice.value.phone_id);
                }, (error_http: HttpErrorResponse) => {
                    this.errorService.manageHttpError(error_http, 'No pudimos agregar el dispositivo', false);
                });
        }
    }

    async logoutUserDevice(){
        const userDevice = this.userDevice.getValue();
        const phone_id = (userDevice && userDevice.phone_id) ? userDevice.phone_id: null;

        const response = await this.logoutDeviceApi(phone_id)
        .pipe(
            catchError(() => of('Error al enviar peticion'))
        )
        .toPromise();
        return response;
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

    setEmailOnesignal(email: string) {
        if (this.platform.is('cordova')) {
            this.oneSignal.setEmail(email);
        }
    }
    logOutEmailOnesignal() {
        if (this.platform.is('cordova')) {
            this.oneSignal.logoutEmail();
        }
    }

    toggleOnesignalSubscription() {
        this.onesignalSubscription = !this.onesignalSubscription;
        if (this.onesignalSubscription) {
            this.messageService.showSuccess('Te has suscrito a las notificaciones :)');
        } else {
            this.messageService.showWarning('Te has desuscrito a las notificaciones :(');
        }
        this.oneSignal.setSubscription(this.onesignalSubscription);
    }

    logoutDeviceApi(deviceID) {
            return this.userService.sendRequestDeleteUserPhoneDevice(deviceID);
    }


    // Función para Obtener ID de Suscriptor de Onesignal
    async getOneSignalIDSubscriptor() {
        //Pedir acceso a notificaciones, en caso de no tenerlas
        if (this.platform.is('cordova')) {
            // this.oneSignal.provideUserConsent(true);
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
        } else {
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
        //Verificar si tengo dato adicional  
        this.managePostNotification(aditionalData);

    }
    async managePostNotification(aditionalDataPost: INotiList) {

        //Manejar evento de POST
        const post = (aditionalDataPost) ? aditionalDataPost.post : null;
        if(post){

            var urlNavigate = null;
    
            let category = (post && post.category_slug) ? post.category_slug : (post && post.category) ? post.category.slug : '';
            let subcategory = (post && post.subcategory_slug) ? post.subcategory_slug : (post && post.subcategory) ? post.subcategory.slug : '';
    
            //Añadir Slug Propio segun id
            if(post && category== '' && post.category_id == 1 && CONFIG.USE_IDS_NOTIFICATION){
                category = 'informe';
            }
    
            if(post && category== '' && post.category_id == 3 && CONFIG.USE_IDS_NOTIFICATION){
                category = 'evento';
                const subcategory_api = await this.postService.getSubcategoriesByCategory(category).pipe(
                    pluck('data'),
                    catchError(() => of({}))
                ).toPromise();
                const subcategory_obj = subcategory_api.filter(subcategory => subcategory.id == post.subcategory_id)
                if(subcategory_obj && subcategory_obj.length > 0 ){
                    subcategory = subcategory_obj[0].slug;
                }
            }
            //en caso de categoria de emergencia
            if(post && category== '' && post.category_id == 4 && CONFIG.USE_IDS_NOTIFICATION){
                category = 'emergencia';
            }
            //en caso de categoria de problema
            if(post && category== '' && post.category_id == 5 && CONFIG.USE_IDS_NOTIFICATION){
                category = 'problema';
                const subcategory_api = await this.postService.getSubcategoriesByCategory(category).pipe(
                    pluck('data'),
                    catchError(() => of([]))
                ).toPromise();
                const subcategory_obj = subcategory_api.filter(subcategory => subcategory.id == post.subcategory_id)
                if(subcategory_obj && subcategory_obj.length > 0 ){
                    subcategory = subcategory_obj[0].slug;
                }
            }
    
            const id_post = (post) ? post.id : null;
            const slug_category = (category) ? category.toLowerCase() : '';
            const slug_subcategory = (subcategory) ? subcategory.toLowerCase() : '';
    
            //Traer post 
            const postApi = await this.postService.getPostDetail(post.id).pipe(pluck('data'), catchError(() => of({}))).toPromise();
    
            if (postApi && id_post && slug_category) {
                //Switch de Opciones segun el slug del posts
                console.log('id_post', id_post)
                console.log('slug_category', slug_category)
                console.log('slug_subcategory', slug_subcategory)
                switch (slug_category) {
                    case CONFIG.EMERGENCIES_SLUG: //caso posts emergencia creado
                        urlNavigate = `/emergencies/list/${id_post}`;
                        break;
                    case CONFIG.EVENTS_SLUG: //caso posts evento creado                   
                        if (slug_subcategory && postApi.state == 1) {
                            urlNavigate = `/events/list/${slug_subcategory}/${id_post}`;
                        } else {
                            urlNavigate = null;
                            // urlNavigate = `events/categories`;
                        }
                        break;
                    case CONFIG.SOCIAL_PROBLEMS_SLUG: // caso posts problema social
                        if (slug_subcategory && postApi.state == 1) {
                            urlNavigate = `/social-problems/list/${slug_subcategory}/${id_post}`;
                        } else {
                            urlNavigate = null;
                            // urlNavigate = `/social-problems/categories`;
                        }
                        break;
                    case CONFIG.REPORTS_SLUG: //caso reporte o informe
                        if(postApi.state == 1){
                            urlNavigate = `/reports/list/${id_post}`;
                        }else{
                            urlNavigate = null;
                        }
                        break;
                    default:
                        urlNavigate = null;
                        break;
                }
    
                if (urlNavigate) {
                    
                    setTimeout(() => {
                        this.navCtrl.navigateForward(urlNavigate);
                        closeModalsOpened();
                    }, 1500);
                }
            }
        }

        //Manejar tipo de acción
        const accion = aditionalDataPost.action;

        switch (accion) {
            case 'logout':
                let tokenDecoded: ITokenDecoded = await this.authService.getTokenUserAuthenticated();
                let roles = getUserRoles(tokenDecoded);
                let hasRoleInvitado = hasRoles(roles, ['invitado']);
                closeModalsOpened();
                if (hasRoleInvitado) {
                    this.authService.logout();
                }           
            default:
                return;
        }
    }
}
