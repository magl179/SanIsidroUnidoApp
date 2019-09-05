import { Injectable, OnInit } from '@angular/core';
import { ToastController, LoadingController, MenuController, Platform, PopoverController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { IMenuComponent } from 'src/app/interfaces/barrios';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Storage } from '@ionic/storage';
import { IPostShare } from 'src/app/interfaces/models';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { ToastOptions } from "@ionic/core";

declare var moment: any;

@Injectable({
    providedIn: 'root'
})
export class UtilsService implements OnInit {



    constructor(
        private iab: InAppBrowser,
        private toastCtrl: ToastController,
        private loadingCtrl: LoadingController,
        private http: HttpClient,
        private menuCtrl: MenuController,
        private storage: Storage,
        private platform: Platform,
        private socialSharing: SocialSharing
    ) { }

    ngOnInit() { }

    ramdomValue(tamanio) {
        return Math.floor(Math.random() * tamanio);
    }

    getUsersFromDetails($details) {
        return $details.map(detail => detail.user_id);
    }

    checkUserInDetails(user_id: number, users_id: number[]) {
        return users_id.includes(user_id);
    }

    openInBrowser(url) {
        const navegador = this.iab.create(url, '_system');
    }


    getBeatifulDate(stringDate: string) {
        moment.locale('es');
        let beatifulDate = null;
        if (moment(stringDate).isValid()) {
            const currentDate = moment(new Date());
            const lastDate = moment(new Date(stringDate));
            // Fecha Pasada, Fecha Actual
            const diffDays = currentDate.diff(lastDate, 'days');
            // console.log('Diferencia entre dias: ', diffDays);
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

    async shareSocial(publicacion: IPostShare) {
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

    async ramdomItem(array) {
        const valueRamdom = await this.ramdomValue(array.length);
        const item = array[valueRamdom];
        return item;
    }

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

    async createBasicLoading(message: string = 'Cargando') {
        const basicloading = await this.loadingCtrl.create({ message });
        return basicloading;
    }

    getMenuOptions() {
        return this.http.get<IMenuComponent[]>('/assets/data/menu.json');
    }

    async enableMenu() {
        await this.menuCtrl.getMenus();
        this.menuCtrl.enable(true, 'main_app_menu');
    }

    async disabledMenu() {
        await this.menuCtrl.getMenus();
        this.menuCtrl.enable(false, 'main_app_menu');
    }

    clearBDD() {
        this.storage.clear();
    }

}
