import { Injectable, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';


@Injectable({
    providedIn: 'root'
})
export class MenuManagedService implements OnInit {

    constructor(
        private menuCtrl: MenuController
    ) { }

    ngOnInit() {
        console.log('Menu Managed Service Started');
    }

    async activarMenu() {
        const menus = await this.menuCtrl.getMenus();
        this.menuCtrl.enable(true, 'menu_principal_app');
    }

    async desactivarMenu() {
        const menus = await this.menuCtrl.getMenus();
        this.menuCtrl.enable(false, 'menu_principal_app');
    }

}
