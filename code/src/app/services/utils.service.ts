import { Injectable } from '@angular/core';
import { ToastController, LoadingController, MenuController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { MenuComponente } from '../interfaces/barrios';

@Injectable({
    providedIn: 'root'
})
export class UtilsService {

    misCoordenadas: {latitud: number, longitud: number} = {
        latitud: null,
        longitud: null
    };

    toastItem: any;

    constructor(
        private toastCtrl: ToastController,
        private loadingCtrl: LoadingController,
        private http: HttpClient,
        private menuCtrl: MenuController
    ) { }

    ramdomValue(tamanio) {
        return Math.floor(Math.random() * tamanio);
    }

    async ramdomItem(array) {
        const valueRamdom = await this.ramdomValue(array.length);
        const item = array[valueRamdom];
        return item;
    }

    async showToast(message?: string, duration?: number, position?: any, color?: string, cssClass?: string, header?: string) {
        this.toastItem = await this.toastCtrl.create({
            animated: true,
            message: message || 'Test Message Toast',
            duration: duration || 2000,
            color: color || 'dark',
            cssClass: cssClass || '',
            header: header || '',
            position: position || 'top'
        });
        this.toastItem.present();
    }

    async createBasicLoading(message: string = 'Cargando') {
        const basicloading = await this.loadingCtrl.create({
            message
        });
        return basicloading;
    }

    getMenuOptions() {
        return this.http.get<MenuComponente[]>('/assets/data/menu.json');
    }

    async enableMenu() {
        const menus = await this.menuCtrl.getMenus();
        this.menuCtrl.enable(true, 'menu_principal_app');
    }

    async disabledMenu() {
        const menus = await this.menuCtrl.getMenus();
        this.menuCtrl.enable(false, 'menu_principal_app');
    }

}
