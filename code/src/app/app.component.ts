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


const URL_PATTERN = new RegExp(/^(http[s]?:\/\/){0,1}(w{3,3}\.)[-a-z0-9+&@#\/%?=~_|!:,.;]*[-a-z0-9+&@#\/%=~_|]/);


@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {

    
    showAppsplash = true;
    isConnected = false;
    menuComponents: IMenuComponent[];
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
        private pushNotificationService: NotificationsService,
        private networkService: NetworkService
    ) {
        this.initializeApp();
    }

    // ionViewWillEnter() {
    //     this.checkInitialStateNetwork();
    // }

    ngOnInit() {
        this.utilsService.getMenuOptions().subscribe((data) => {
            this.menuComponents = data;
            this.menuComponents[0].open = false;
        });
    }

    async initializeApp() {
        await this.authService.verificarAuthInfo();
        await this.checkInitialStateNetwork();
        await this.platform.ready().then(async () => {
            await this.statusBar.styleDefault();
            await this.splashScreen.hide();
            await this.checkUserLoggedIn();
            timer(3000).subscribe(async () => {
                this.showAppsplash = false;
                await this.pushNotificationService.initialConfig();
               
            });
        });
    }

    async checkUserLoggedIn() {
        await this.authService.getAuthUser().subscribe(res => {
            if (res) {
                this.userApp = res.user;
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
        // console.log('network check state');
        // await this.networkService.testNetworkConnection();
        // const isOnline = this.networkService.getNetworkTestValue();
        // this.isConnected = isOnline;
        // if (!isOnline) {
        //     this.utilsService.showToast('Por favor enciende tu conexión a Internet');
        //     console.log('No tienes conexion a Internet');
        // }
        this.networkService.getNetworkStatus().subscribe((connected: boolean) => {
            this.isConnected = connected;
            console.log('Network status', connected);
            if (!this.isConnected) {
                this.utilsService.showToast('Por favor enciende tu conexión a Internet');
            }
        });
    }

    getImageURL(image_name) {
        const imgIsURL = URL_PATTERN.test(image_name);
        if (imgIsURL) {
            return image_name;
        } else {
            return `${environment.apiBaseURL}/${environment.image_blob_url}/${image_name}`;
        }
    }

}
