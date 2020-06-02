import { Component, OnInit } from '@angular/core';
import { Platform, MenuController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { timer } from 'rxjs';
import { IMenuOptions, ITokenDecoded, IMenuComponent } from './interfaces/models';
import { AlertController } from '@ionic/angular';
import { AuthService } from './services/auth.service';
import { NotificationsService } from './services/notifications.service';
import { NetworkService } from 'src/app/services/network.service';
import { LocalDataService } from './services/local-data.service';
import { mapUser } from "./helpers/utils";
import { map} from 'rxjs/operators';
import { NavigationService } from './services/navigation.service';
import { MessagesService } from './services/messages.service';


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
    sessionAuth: ITokenDecoded = null;

    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private localDataService: LocalDataService,
        private statusBar: StatusBar,
        private alertController: AlertController,
        private authService: AuthService,
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
        this.platform.ready().then(async () => {
            await this.checkInitialStateNetwork();
            if (this.platform.is('cordova')) {
                this.statusBar.styleDefault();
                this.splashScreen.hide();
            }
            await this.checkUserLoggedIn();
            await this.getMenuOptions();
            this.showAppsplash = false;
            timer(1500).subscribe(async () => {
                await this.pushNotificationService.initialConfig();
            });
            // this.backgroundMode.enable();
            // this.navigationService.keepHistoryTracking();
        });
    }
    
    async checkUserLoggedIn() {
        this.authService.sessionAuthUser.pipe(
            map((token_decoded: ITokenDecoded) => {
                if (token_decoded && token_decoded.user) {
                    token_decoded.user = mapUser(token_decoded.user);
                }
                return token_decoded;
            })
        ).subscribe(token_decoded => {
            this.sessionAuth = token_decoded;
            if (token_decoded) {
                this.authService.checkValidToken();
            }
        });
    }

    closeAppSession() {
        this.confirmCloseSession();
    }

    loginAppSesion() {
        this.authService.redirectToLogin();
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
                        await this.authService.logout('');
                        await this.menuCtrl.close();
                    }
                }
            ]
        });

        await alert.present();
    }

    toggleSection(component_name: string, index: number, hasChild: boolean) {
        this.menuComponents[component_name][index].open = !this.menuComponents[component_name][index].open;
        if (this.automaticClose && this.menuComponents[component_name][index].open) {
            this.menuComponents[component_name]
                .filter((item: IMenuComponent, itemIndex: number) => {
                    if (hasChild) {
                        return itemIndex !== index && item.children.length > 0;
                    } else {
                        return item.children.length > 0;
                    }
                })
                .map((item: IMenuComponent) => item.open = false);
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
