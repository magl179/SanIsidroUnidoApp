import { Component, OnInit } from '@angular/core';
import { Platform, NavController, MenuController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { timer } from 'rxjs';
import { IMenuComponent } from './interfaces/barrios';
import { AlertController } from '@ionic/angular';
import { AuthService } from './services/auth.service';
import { UtilsService } from './services/utils.service';
import { NotificationsService } from './services/notifications.service';
import { NetworkService } from 'src/app/services/network.service';
import { environment } from '../environments/environment';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

    
    showAppsplash = true;
    isConnected = false;
    menuComponents: IMenuComponent[];
    automaticClose = true;
    authUser: any = null;
    authUserRol = null;

    constructor(
        private platform: Platform,
        private navCtrl: NavController,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        private alertController: AlertController,
        private authService: AuthService,
        private utilsService: UtilsService,
        private menuCtrl: MenuController,
        private pushNotificationService: NotificationsService,
        private networkService: NetworkService
    ) {
        this.initializeApp();
    }

    ngOnInit() {
        this.utilsService.getMenuOptions().subscribe((data) => {
            this.menuComponents = data;
            this.menuComponents[0].open = false;
        });
    }

    getRoles() {
        if (this.authUser && this.authUser.roles) {
            const roles = this.authUser.roles.map(role => role.slug);
            const rol = roles.find(rol => environment.roles_permitidos.includes(rol));
            if (rol) {
                this.authUserRol = rol;
            }
        }
    }

    async initializeApp() {
        await this.authService.verificarAuthInfo();
        console.log('auth info verified');
        await this.checkInitialStateNetwork();
        console.log('red checked status');
        await this.platform.ready().then(async () => {
            console.log('platform ready');
            if (this.platform.is('cordova')) {
                this.statusBar.styleDefault();
                this.splashScreen.hide();
                console.log('splash screen native ready');
            }
            await this.checkUserLoggedIn();
            console.log('load info user logued');
            timer(2800).subscribe(async () => {
                this.showAppsplash = false;
                console.log('hide own splash screen');
                await this.pushNotificationService.initialConfig();
            });
        });
    }

    async checkUserLoggedIn() {
        this.authService.getAuthUser().subscribe(res => {
            if (res) {
                this.authUser = res.user;
                this.getRoles();
            }
        }, err => {
                console.log('Error', err);
        });
    }

    closeAppSession() {
        this.confirmCloseSession();
    }

    closeMenu() {
        this.menuCtrl.close();
    }

    async confirmCloseSession() {
        const alert = await this.alertController.create({
            header: 'Cerrar Sesión',
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
                            this.navCtrl.navigateRoot('/tutorial');
                        });
                    }
                }
            ]
        });

        await alert.present();
    }

    toggleSection(index: any, hasChild: boolean) {
        this.menuComponents[index].open = !this.menuComponents[index].open;
        if (this.automaticClose && this.menuComponents[index].open) {
            this.menuComponents
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

    async checkInitialStateNetwork() {
        this.networkService.getNetworkStatus().subscribe((connected: boolean) => {
            this.isConnected = connected;
            if (!this.isConnected) {
                this.utilsService.showToast('Por favor enciende tu conexión a Internet');
            }
        });
    }

}
