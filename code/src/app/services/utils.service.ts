import { Injectable, OnInit } from '@angular/core';
import { ToastController, LoadingController, MenuController, Platform } from '@ionic/angular';
// import { HttpClient, HttpRequest } from "@angular/common/http";
import { IMenuComponent } from 'src/app/interfaces/barrios';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Storage } from '@ionic/storage';
import { IPostShare, I_ImagesApi } from 'src/app/interfaces/models';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { ToastOptions } from "@ionic/core";
import { HttpRequestService } from "./http-request.service";
import { environment } from 'src/environments/environment';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
// import { ImageDetailPage } from "../modals/image_detail/image_detail.page";

declare var moment: any;


@Injectable({
    providedIn: 'root'
})
export class UtilsService implements OnInit {

    URL_PATTERN = new RegExp("^(?:(?:http(?:s)?|ftp)://)(?:\\S+(?::(?:\\S)*)?@)?(?:(?:[a-z0-9\u00a1-\uffff](?:-)*)*(?:[a-z0-9\u00a1-\uffff])+)(?:\\.(?:[a-z0-9\u00a1-\uffff](?:-)*)*(?:[a-z0-9\u00a1-\uffff])+)*(?:\\.(?:[a-z0-9\u00a1-\uffff]){2,})(?::(?:\\d){2,5})?(?:/(?:\\S)*)?$");

    constructor(
        private iab: InAppBrowser,
        // private modalCtrl: ModalController,
        private toastCtrl: ToastController,
        private loadingCtrl: LoadingController,
        // private http: HttpClient,
        private photoViewer: PhotoViewer,
        private httpRequest: HttpRequestService,
        private menuCtrl: MenuController,
        private storage: Storage,
        private platform: Platform,
        private socialSharing: SocialSharing
    ) { }

    ngOnInit() { }
    // Funcion para obtener un valor aleatorio de un tamaño en especifico
    ramdomValue(tamanio) {
        return Math.floor(Math.random() * tamanio);
    }

    seeImageDetail(url: string, title = "Detalle Imagen", share = true) {
            this.photoViewer.show(url, title, {share});
    }
    //Funcion verifica like en un posts
    checkLikePost(details: any, user_authenticated: any) {
        if (details && details.length > 0) {
            const likes_user = this.getUsersFromDetails(details);
            const user_made_like = this.checkUserInDetails(user_authenticated.id, likes_user);
            return user_made_like;
        }
        else {
            return false;
        }
    }
    // Function obtener los detalles de un usuario
    getUsersFromDetails($details) {
        return $details.map(detail => detail.user_id);
    }
    // Funcion para verificar si un usuario ha dado like o asistencia en un detalle de un post
    checkUserInDetails(user_id: number, users_id: number[]) {
        return users_id.includes(user_id);
    }
    //Abrir el navegador
    openInBrowser(url) {
        const navegador = this.iab.create(url, '_system');
    }

    mapImagesApi(images: I_ImagesApi[]) {
        return images.map((image: I_ImagesApi) => {
            image.url = this.getImageURL(image.url);
            // console.log('image returned', image.url);
            return image;
        });
    }

    //Obtener la fecha formateada con MomentJS
    getBeatifulDate(stringDate: string) {
        moment.locale('es');
        let beatifulDate = null;
        if (moment(stringDate).isValid()) {
             // Fecha Pasada, Fecha Actual
            const currentDate = moment(new Date());
            const lastDate = moment(new Date(stringDate));
            //Diferencia entre Fechas
            const diffDays = currentDate.diff(lastDate, 'days');
            // Formatear Fecha
            if (diffDays <= 8) {
                beatifulDate = lastDate.fromNow();
            } else if (currentDate.year() === lastDate.year()) {
                beatifulDate = lastDate.format('D MMMM');
            } else {
                beatifulDate = lastDate.format('LL');
            }
        } else {
            console.log('Invalid Date', stringDate);
        }
        return beatifulDate;
    }

    async shareSocial(publicacion: any) {
        // Verificar Si Existe Cordova
        if (this.platform.is('cordova')) {
            await this.socialSharing.share(
                publicacion.description, // message
                publicacion.title, // subject
                (publicacion.image) ? publicacion.image : '', // file image or [] images
                publicacion.url || '' // url to share
            );
        } else {
            // tslint:disable-next-line: no-string-literal
            if (navigator['share']) {
                // tslint:disable-next-line: no-string-literal
                await navigator['share']({
                    text: publicacion.description,
                    title: publicacion.title,
                    url: publicacion.url || ''
                }).then(() => {
                    console.log('Compartido Correctamente');
                }).catch(err => {
                    console.log('Error al compartir');
                    this.showToast('No se pudo compartir');
                });
            } else {
                console.log('Tu dispositivo no soporta la función de compartir');
                await this.showToast('Tu dispositivo no soporta la función de compartir');
            }
        }
    }
    //Obtener la fecha junta
    getFullDate(date, time) {
        const fulldate = `${date} ${time}`;
        return fulldate;
    }
    //Obtener un item aleatorio de un array
    async ramdomItem(array) {
        const valueRamdom = await this.ramdomValue(array.length);
        const item = array[valueRamdom];
        return item;
    }
    //Crear un toast
    async showToast(message?: string, duration?: number, position?: any, color?: string, cssClass?: string) {
        const toast: ToastOptions = {
            animated: true,
            message: message || 'Test Message Toast',
            duration: duration || 1000,
            color: color || 'dark',
            cssClass: cssClass || '',
            position: position || 'top'
        }
        const toastItem = await this.toastCtrl.create(toast);
        toastItem.present();
    }
    //crear un loading
    async createBasicLoading(message: string = 'Cargando') {
        const basicloading = await this.loadingCtrl.create({ message });
        return basicloading;
    }
    //Obtener las opciones del menu
    getMenuOptions() {
        return this.httpRequest.get<IMenuComponent[]>('/assets/data/menu.json');
    }
    //Activar Menu APP
    async enableMenu() {
        await this.menuCtrl.getMenus();
        this.menuCtrl.enable(true, 'main_app_menu');
    }
    // Desactivar Menu de la APP
    async disabledMenu() {
        await this.menuCtrl.getMenus();
        this.menuCtrl.enable(false, 'main_app_menu');
    }
    // Limpiar Storage IONIC
    clearBDD() {
        this.storage.clear();
    }

    //Función Obtener Backgound
    getBackgroundApp(image_url: string) {
        return `linear-gradient(rgba(2, 2, 2, 0.58), rgba(2, 2, 2, 0.58)), url(${image_url})`;
    }
    //Obtener la URL de una imagen
    getImageURL(image_name: string) {
        const imgIsURL = this.URL_PATTERN.test(image_name);
        // console.log('is image/ url extern', imgIsURL);
        // console.log('is image url extern', image_name);
        if (imgIsURL) {
            return image_name;
        } else {
            return `${environment.apiBaseURL}/${environment.image_assets}/${image_name}`;
        }
    }

    imgIsURL(image_name: string) {
        return this.URL_PATTERN.test(image_name);
    }

    isJSON(str) {
        try {
          return JSON.parse(str) && !!str;
        } catch (e) {
          return false;
        }
    }
    
    getJSON(variable){
        if(typeof variable === 'object'){
          return variable;
        }
        if(this.isJSON(variable)){
          return JSON.parse(variable);
        } else {
          return null;
        }
      }
}
