import { Component, OnInit } from '@angular/core';
import { Platform, NavController, MenuController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { timer } from 'rxjs';
import { IMenuOptions } from './interfaces/models';
import { AlertController } from '@ionic/angular';
import { AuthService } from './services/auth.service';
import { UtilsService } from './services/utils.service';
import { NotificationsService } from './services/notifications.service';
import { NetworkService } from 'src/app/services/network.service';
import { LocalDataService } from './services/local-data.service';
import { mapUser } from "./helpers/utils";
import { map} from 'rxjs/operators';
import { NavigationService } from './services/navigation.service';
import { MessagesService } from './services/messages.service';
import { LocalizationService } from './services/localization.service';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

    showAppsplash = true;
    isConnected = false;
    menuComponents: IMenuOptions;
    automaticClose = true;
    sessionAuth: any = null;

    constructor(
        private platform: Platform,
        private navCtrl: NavController,
        private splashScreen: SplashScreen,
        private localDataService: LocalDataService,
        private statusBar: StatusBar,
        private alertController: AlertController,
        private authService: AuthService,
        private utilsService: UtilsService,
        private localizationService: LocalizationService,
        private navigationService: NavigationService,
        private menuCtrl: MenuController,
        private pushNotificationService: NotificationsService,
        private networkService: NetworkService,
        private messageService: MessagesService,
    ) {
        this.initializeApp();
    }

    ngOnInit() { }

    async getMenuOptions() {
        this.localDataService.getMenuOptions().subscribe((data: IMenuOptions) => {
            this.menuComponents = data;
        });
    }

    initializeApp() {
        //Execute all Code Here
        this.platform.ready().then(async () => {
            await this.checkInitialStateNetwork();
            if (this.platform.is('cordova')) {
                this.statusBar.styleDefault();
                this.splashScreen.hide();
            }
            //verificar token en el backend
            await this.checkUserLoggedIn();
            await this.getMenuOptions();
            this.showAppsplash = false;
            timer(1000).subscribe(async () => {
                await this.pushNotificationService.initialConfig();
                //  await this.localizationService.checkInitialGPSPermissions();
            });
            this.navigationService.keepHistoryTracking();
        });
    }
    
    async checkUserLoggedIn() {
        this.authService.sessionAuthUser.pipe(
            map((token_decoded: any) => {
                if (token_decoded && token_decoded.user) {
                    token_decoded.user = mapUser(token_decoded.user);
                }
                return token_decoded;
            })
        ).subscribe(token_decoded => {
            if (token_decoded) {
                this.sessionAuth = token_decoded;
                this.authService.checkValidToken();
            }
        }, (err: any) => {
            console.log('Error', err);
        });
    }

    closeAppSession() {
        this.confirmCloseSession();
    }

    loginAppSesion() {
        this.authService.logout();
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
                    }
                }, {
                    text: 'Cerrar Sesión',
                    cssClass: 'confirm_button',
                    handler: async () => {
                        await this.authService.logout('Has cerrado sesión correctamente');
                        await this.menuCtrl.close();
                    }
                }
            ]
        });

        await alert.present();
    }

    toggleSection(component_name: string, index: any, hasChild: boolean) {
        this.menuComponents[component_name][index].open = !this.menuComponents[component_name][index].open;
        if (this.automaticClose && this.menuComponents[component_name][index].open) {
            this.menuComponents[component_name]
                .filter((item: any, itemIndex: number) => {
                    if (hasChild) {
                        return itemIndex !== index && item.children.length > 0;
                    } else {
                        return item.children.length > 0;
                    }
                })
                .map((item: any) => item.open = false);
        }
    }

    async checkInitialStateNetwork() {
        this.networkService.getNetworkStatus().subscribe((connected: boolean) => {
            this.isConnected = connected;
            if (!this.isConnected) {
                this.messageService.showInfo('Por favor enciende tu conexión a Internet');
            }
        });
    }

}
