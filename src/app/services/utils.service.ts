import { Injectable, OnInit } from '@angular/core';
import { ToastController, LoadingController, MenuController, Platform, NavController } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Storage } from '@ionic/storage';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { ToastOptions } from "@ionic/core";
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { CONFIG } from '../../config/config';

declare var moment: any;

@Injectable({
    providedIn: 'root'
})
export class UtilsService implements OnInit {

    constructor(
        private iab: InAppBrowser,
        private toastCtrl: ToastController,
        private loadingCtrl: LoadingController,
        private photoViewer: PhotoViewer,
        private menuCtrl: MenuController,
        private storage: Storage,
        private platform: Platform,
        private socialSharing: SocialSharing
    ) { }

    ngOnInit() { }
    // Funcion para obtener un valor aleatorio de un tamaño en especifico
    
    seeImageDetail(url: string, title = "Detalle Imagen", share = true) {
        if (this.platform.is('cordova')) {
            this.photoViewer.show(url, title, { share });
        } else {
            this.openInBrowser(`${url}`);
        }
    }
    
    //Abrir el navegador
    openInBrowser(url: string) {
        if (this.platform.is('cordova')) { 
            this.iab.create(url, '_system');
        }else{
            window.open(url, '_blank');
        }
    }

    //Obtener la fecha formateada con MomentJS
    getBeatifulDate(stringDate: string) {
        moment.locale('es');
        let beatifulDate = null;
        let lastDate: any;
        if (moment(stringDate).isValid()) {
            lastDate = moment(new Date(stringDate));
        } else {
            lastDate = moment(new Date());
        }
        // Fecha Pasada, Fecha Actual
        const currentDate = moment(new Date());
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
        return beatifulDate;
    }


    async shareSocial(publicacion: any) {


        const message_publication = `${publicacion.description} \n\n${CONFIG.MESSAGE_APP_INFO}\n`;

        // Verificar Si Existe Cordova
        if (this.platform.is('cordova')) {
            const share_options = {
                message: message_publication, // not supported on some apps (Facebook, Instagram)
                subject: publicacion.title, // fi. for email
                files: (publicacion.image) ? publicacion.image : '', // an array of filenames either locally or remotely
                url: CONFIG.MESSAGE_APP_URL,
                // chooserTitle: 'Pick an app', // Android only, you can override the default share sheet title
                // appPackageName: 'com.apple.social.facebook', // Android only, you can provide id of the App you want to share with
                // iPadCoordinates: '0,0,0,0' //IOS only iPadCoordinates for where the popover should be point.  Format with x,y,width,height
              };
            return await this.socialSharing.shareWithOptions(share_options)
            .then(async(result) => {
                if(result.completed){
                    await this.showToast({message: 'Compartido Correctamente'});
                }
            }).catch(async(err) => {
                console.error('Error al compartir', err);
                //throw new Error('Ocurrio un error al compartir')
               this.showToast({message: 'No se pudo compartir'});
            });
        } else {
            if (navigator['share']) {
                return await navigator['share']({
                    text: publicacion.description,
                    title: publicacion.title,
                    url: publicacion.url || ''
                }).then(async() => {
                    await this.showToast({message: 'Compartido Correctamente'});
                }).catch(async(err) => {
                    console.error('Error al compartir', err);
                   this.showToast({message: 'No se pudo compartir'});
                });
            } else {
                await this.showToast({message: 'Tu dispositivo no soporta la función de compartir'});
            }
        }
    }
   
    //Crear un toast
    async showToast(toastObj: ToastOptions) {
        const toastDefault = {
            animated : true,
            message : 'Notificación de Prueba',
            duration: 2000,
            color: 'dark',
            cssClass: '',
            position: 'top'
        };
        const new_toast = Object.assign(toastDefault, toastObj);
        const toastItem = await this.toastCtrl.create(new_toast);
        toastItem.present();
    }
    //crear un loading
    async createBasicLoading(message = 'Cargando') {
        const basicloading = await this.loadingCtrl.create({ message });
        return basicloading;
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
    //Cerrar Menu
    async closeMenu() {
        await this.menuCtrl.getMenus();
        this.menuCtrl.close();
    }
    //Abrir Menu
    async openMenu() {
        await this.menuCtrl.getMenus();
        this.menuCtrl.open();
    }
    // Limpiar Storage IONIC
    clearBDD() {
        this.storage.clear();
    }  

    
}
