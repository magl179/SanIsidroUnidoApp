import { Component, OnInit } from '@angular/core';
import { Platform, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { timer } from 'rxjs';
import { DataAppService } from './services/data-app.service';
import { MenuComponente } from './interfaces/barrios';

import { AlertController } from '@ionic/angular';


@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {

    // componentesMenu: Observable<MenuComponente[]>;
    showAppsplash = true;
    componentesMenu: MenuComponente[];
    automaticClose = true;

    constructor(
        private platform: Platform,
        private navCtrl: NavController,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        private dataAppService: DataAppService,
        private alertController: AlertController
    ) {
        this.initializeApp();
    }

    ngOnInit() {
        this.dataAppService.getMenuOptions().subscribe((data) => {
            // console.log(data);
            this.componentesMenu = data;
            this.componentesMenu[0].open = false;
        });
    }

    async initializeApp() {
        await this.platform.ready().then(() => {
            this.statusBar.styleDefault();
            this.splashScreen.hide();
            // console.log('App ready show splash');
            timer(3200).subscribe(() => this.showAppsplash = false);
            // console.log('Splash Doit hide splash');
        });
    }

    cerrarSesion() {
        this.confirmarCierreSesion();
    }

    async confirmarCierreSesion() {
        const alert = await this.alertController.create({
            header: 'Cerrar Sesión',
            // subHeader: 'Subtitle',
            message: 'Estas seguro que deseas cerrar sesión?',
            cssClass: 'alertButtons',
            buttons: [
                {
                    text: 'Cancelar',
                    role: 'cancel',
                    cssClass: 'cancel_button',
                    handler: (blah) => {
                        console.log('Confirm Cancel: blah');
                    }
                }, {
                    text: 'Cerrar Sesión',
                    cssClass: 'confirm_button',
                    handler: () => {
                        console.log('Confirm Okay');
                        this.navCtrl.navigateRoot('/home');
                    }
                }
            ]
        });

        await alert.present();
    }

    toggleSection(index, hasChild) {
        this.componentesMenu[index].open = !this.componentesMenu[index].open;
        if (this.automaticClose && this.componentesMenu[index].open) {
            this.componentesMenu
                .filter((item, itemIndex) => {
                    if (hasChild) {
                        return itemIndex !== index && item.children.length > 0;
                    } else {
                        return item.children.length > 0;
                    }
                })
                .map(item => item.open = false);
        }
    }
}
