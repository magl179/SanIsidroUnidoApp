import { Injectable, OnInit } from '@angular/core';
import { ToastController, LoadingController, MenuController, Platform } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { IMenuComponent, IPostShare } from 'src/app/interfaces/barrios';
import { Storage } from '@ionic/storage';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

declare var moment: any;

@Injectable({
    providedIn: 'root'
})
export class UtilsService implements OnInit {



    constructor(
        private toastCtrl: ToastController,
        private loadingCtrl: LoadingController,
        private http: HttpClient,
        private menuCtrl: MenuController,
        private storage: Storage,
        private platform: Platform,
        private socialSharing: SocialSharing
    ) { }

    async ngOnInit() { }

    ramdomValue(tamanio) {
        return Math.floor(Math.random() * tamanio);
    }

    getUsersFromDetails($details) {
        return $details.map(detail => detail.user_id);
    }

    checkUserInDetails(user_id: number, users_id: number[]) {
        // return users_id.includes(user_id);
        // return users_id.includes(user_id);
        return users_id.includes(user_id);
        // return (users_id.indexOf(user_id) === -1);
    }

    getBeatifulDate(stringDate: string) {
        moment.locale('es');
        let beatifulDate = null;
        if (moment(stringDate).isValid()) {
            console.log('Valid Date');
            const currentDate = moment(new Date());
            const lastDate = moment(new Date(stringDate));
            // Fecha Pasada, Fecha Actual
            const diffDays = currentDate.diff(lastDate, 'days');
            console.log('Diferencia entre dias: ', diffDays);
            if (diffDays <= 8) {
                // console.log('Fecha Anterior', lastDate.fromNow());
                beatifulDate = lastDate.fromNow();
            } else if (currentDate.year() === lastDate.year()) {
                // console.log('Fecha Anterior: ', lastDate.format('D MMMM'));
                beatifulDate = lastDate.format('D MMMM');

            } else {
                // console.log('Fecha Anterior', lastDate.format('LL'));
                beatifulDate = lastDate.format('LL');
            }
        } else {
            console.log('Invalid Date', stringDate);
        }
        return beatifulDate;
    }

    async compartirRedSocial(publicacion: IPostShare) {
        // Verificar Si Existe Cordova
        if (this.platform.is('cordova')) {
            await this.socialSharing.share(
                publicacion.title, // message
                publicacion.description, // subject
                (publicacion.image) ? publicacion.image : '', // file image or [] images
                publicacion.url || '' // url to share
            );
        } else {
            // tslint:disable-next-line: no-string-literal
            if (navigator['share']) {
                // tslint:disable-next-line: no-string-literal
                await navigator['share']({
                    title: publicacion.title,
                    text: publicacion.description,
                    url: publicacion.url || ''
                }).then(() => {
                    console.log('Compartido Correctamente');
                }).catch(err => {
                    console.log('Error al compartir');
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

    async showToast(message?: string, duration?: number, position?: any, color?: string, cssClass?: string, header?: string) {
        const toastItem = await this.toastCtrl.create({
            animated: true,
            message: message || 'Test Message Toast',
            duration: duration || 1000,
            color: color || 'dark',
            cssClass: cssClass || '',
            header: header || '',
            position: position || 'top'
        });
        toastItem.present();
    }

    async createBasicLoading(message: string = 'Cargando') {
        const basicloading = await this.loadingCtrl.create({
            message
        });
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
