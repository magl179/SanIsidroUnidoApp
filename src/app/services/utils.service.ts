import { Injectable, OnInit } from '@angular/core';
import { ToastController, LoadingController, MenuController, Platform } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Storage } from '@ionic/storage';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { ToastOptions } from "@ionic/core";
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { CONFIG } from 'src/config/config';
import {imagenIsURL} from 'src/app/helpers/utils'
import { ISharePost } from '../interfaces/models';

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
            if(imagenIsURL(url)){
                window.open(url, '_blank');
            }else{
                this.openBase64InNewTab(url);
            }
        }
    }

    openBase64InNewTab (data: string) {
        var newTab = window.open();
        newTab.document.body.innerHTML = `<img src="${data}" width="100px" height="100px">`;
    }

    async shareSocial(publicacion: ISharePost): Promise<any> {

        const message_publication = `${publicacion.description} \n\n${CONFIG.MESSAGE_APP_INFO}\n`;

        // Verificar Si Existe Cordova
        if (this.platform.is('cordova')) {
            const share_options = {
                message: message_publication, 
                subject: publicacion.title,
                files: (publicacion.image) ? publicacion.image : '',
                url: CONFIG.MESSAGE_APP_URL,
              };
            return await this.socialSharing.shareWithOptions(share_options)
            .then(async(result) => {
                if(result.completed){
                    await this.showToast({message: 'Compartido Correctamente'});
                }
            }).catch(async() => {});
        } else {
            if (navigator['share']) {
                return await navigator['share']({
                    text: publicacion.description,
                    title: publicacion.title,
                    url: publicacion.url || ''
                }).then(async() => {
                    await this.showToast({message: 'Compartido Correctamente'});
                }).catch(async() => {});
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
