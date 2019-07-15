import { Injectable, OnInit } from '@angular/core';
import { ToastController, LoadingController, MenuController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { IMenuComponent } from 'src/app/interfaces/barrios';
import { Storage } from '@ionic/storage';

@Injectable({
    providedIn: 'root'
})
export class UtilsService implements OnInit {

    constructor(
        private toastCtrl: ToastController,
        private loadingCtrl: LoadingController,
        private http: HttpClient,
        private menuCtrl: MenuController,
        private storage: Storage
    ) { }

    async ngOnInit() { }

    ramdomValue(tamanio) {
        return Math.floor(Math.random() * tamanio);
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
        this.menuCtrl.enable(true, 'menu_principal_app');
    }

    async disabledMenu() {
        await this.menuCtrl.getMenus();
        this.menuCtrl.enable(false, 'menu_principal_app');
    }

    clearBDD() {
        this.storage.clear();
    }

}
