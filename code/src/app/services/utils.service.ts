import { Injectable, OnInit } from '@angular/core';
import { ToastController, LoadingController, MenuController, Platform } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Storage } from '@ionic/storage';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { ToastOptions } from "@ionic/core";
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';

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
        this.photoViewer.show(url, title, { share });
    }
    
    //Abrir el navegador
    openInBrowser(url: string) {
        const navegador = this.iab.create(url, '_system');
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
            if (navigator['share']) {
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

    
}
