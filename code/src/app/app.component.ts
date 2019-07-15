import { Component, OnInit } from '@angular/core';
import { Platform, NavController, MenuController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { timer } from 'rxjs';
import { IMenuComponent } from './interfaces/barrios';
import { AlertController } from '@ionic/angular';
import { AuthService } from './services/auth.service';
import { UtilsService } from './services/utils.service';
import { ConnectionService } from 'ng-connection-service';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {

    showAppsplash = true;
    componentesMenu: IMenuComponent[];
    automaticClose = true;
    userApp: any = null;

    constructor(
        private platform: Platform,
        private navCtrl: NavController,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        private alertController: AlertController,
        private authService: AuthService,
        private utilsService: UtilsService,
        private menuCtrl: MenuController,
        private connectionService: ConnectionService
    ) {
        this.initializeApp();
    }

    ngOnInit() {
        this.utilsService.getMenuOptions().subscribe((data) => {
            this.componentesMenu = data;
            this.componentesMenu[0].open = false;
        });
    }

    async initializeApp() {
        await this.comprobarUsuarioLogueado();
        await this.platform.ready().then(async () => {
            await this.statusBar.styleDefault();
            await this.splashScreen.hide();
            timer(3200).subscribe(() => {
                this.showAppsplash = false;
                this.comprobarRed();
            });
        });
    }

    comprobarRed() {
        this.connectionService.monitor().subscribe(isConnected => {
            if (isConnected) {
                this.utilsService.showToast('You are Online', 1000);
            } else {
                this.utilsService.showToast('You are Offline', 1000);
            }
        });
    }

    async comprobarUsuarioLogueado() {
        // this.userApp = await this.authService.getCurrentUser();
        await this.authService.user.subscribe(data => {
            if (data) {
                this.userApp = data;
            }
        });
    }

    cerrarSesion() {
        this.confirmarCierreSesion();
    }

    closeMenu() {
        this.menuCtrl.close();
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
                    handler: async () => {
                        console.log('Confirm Okay');
                        await this.authService.logout();
                        await this.menuCtrl.close();
                        timer(400).subscribe(() => {
                            this.navCtrl.navigateRoot('/login');
                        });
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
