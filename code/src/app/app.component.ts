import { Component, OnInit } from '@angular/core';
import { Platform, NavController, MenuController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { timer } from 'rxjs';
import { IMenuComponent } from './interfaces/models';
import { AlertController } from '@ionic/angular';
import { AuthService } from './services/auth.service';
import { UtilsService } from './services/utils.service';
import { NotificationsService } from './services/notifications.service';
import { NetworkService } from 'src/app/services/network.service';
import { environment } from 'src/environments/environment';
import { LocalDataService } from './services/local-data.service';
// import { mapUser } from './helpers/user-helper';
import { getImageURL, mapUser } from "./helpers/utils";
import { map, finalize } from 'rxjs/operators';

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
    sessionAuth: any = null;
    // AuthUserRol = null;

    constructor(
        private platform: Platform,
        private navCtrl: NavController,
        private splashScreen: SplashScreen,
        private localDataService: LocalDataService,
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

    ngOnInit() { }

    async getMenuOptions() {
        this.localDataService.getMenuOptions().subscribe((data: any) => {
            this.menuComponents = data;
            this.menuComponents[0].open = false;
        });
    }

    initializeApp() {
        //Execute all Code Here
        this.platform.ready().then(async () => {
            console.log('platform ready');
            await this.checkInitialStateNetwork();
            if (this.platform.is('cordova')) {
                this.statusBar.styleDefault();
                this.splashScreen.hide();
            }
            await this.checkUserLoggedIn();
            await this.getMenuOptions();
            // console.log('load info user logued');
            timer(2800).subscribe(async () => {
                this.showAppsplash = false;
                await this.pushNotificationService.initialConfig();
            });
        });
    }

    // manageInitialPage(token_decoded: any) {
    //     if (!token_decoded) {
    //         // console.log('app redirect login');
    //         // this.navCtrl.navigateRoot('/login');
    //     }
    // }

    async checkUserLoggedIn() {
        this.authService.sessionAuthUser.pipe(
            map((token_decoded: any) => {
                if (token_decoded && token_decoded.user) {
                    token_decoded.user = mapUser(token_decoded.user);
                }
                return token_decoded;
            }) ,
            finalize(() => {
                this.authService.checkValidToken();                
            })
        ).subscribe(token_decoded => {
            if (token_decoded) {
                this.sessionAuth = token_decoded;
            }
        }, (err: any) => {
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
                this.utilsService.showToast({message: 'Por favor enciende tu conexión a Internet'});
            }
        });
    }

}
