import { Component, OnInit } from '@angular/core';
import { Platform, MenuController, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { timer, of } from 'rxjs';
import { IMenuOptions, ITokenDecoded, IMenuComponent } from './interfaces/models';
import { AlertController } from '@ionic/angular';
import { AuthService } from './services/auth.service';
import { NotificationsService } from './services/notifications.service';
import { NetworkService } from 'src/app/services/network.service';
import { mapUser } from "./helpers/utils";
import { map, tap, concatMap, mergeAll, pluck, catchError} from 'rxjs/operators';
import { MessagesService } from './services/messages.service';
import { MENU_ITEMS_APP} from 'src/app/config/menu';
import { environment } from 'src/environments/environment';
import { UserService } from './services/user.service';

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
        private statusBar: StatusBar,
        private navCtrl: NavController,
        private alertController: AlertController,
        private userService: UserService,
        private authService: AuthService,
        private menuCtrl: MenuController,
        private pushNotificationService: NotificationsService,
        private networkService: NetworkService,
        private messageService: MessagesService,
    ) {
        this.initializeApp();
    }

    imgError(event): void {
        event.target.src = 'assets/img/default/img_avatar.png'
    }

    ngOnInit():void { }

    getMenuOptions():void {
        this.menuComponents = MENU_ITEMS_APP
    }

    initializeApp() {
        this.platform.ready().then(async () => {
            
            await this.checkInitialStateNetwork();
            if (this.platform.is('cordova')) {
                this.statusBar.styleDefault();
                this.splashScreen.hide();
            }
            await this.checkUserLoggedIn();
            this.getMenuOptions();
            this.showAppsplash = false;
            timer(1000).subscribe(async () => {
                await this.pushNotificationService.initialConfig();
            });
            //Redirigir con sesión iniciada
            const tokenExists = await this.authService.isAuthenticated();
            if(tokenExists && environment.production){
                this.navCtrl.navigateRoot(`/home-list`)
            }
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
        ).subscribe(async token_decoded => {
            this.sessionAuth = token_decoded;
            console.log('sessionAuth', this.sessionAuth);
            if (token_decoded) {
                this.authService.checkValidToken();
                const login_method = await this.authService.getMethodLogin();
                const email_verified_at = (this.sessionAuth && this.sessionAuth.user) ?this.sessionAuth && this.sessionAuth.user.email_verified_at: null;
    
                if((email_verified_at == "" || email_verified_at == null && login_method == 'formulario')){
                    this.messageService.showPersistenceNoti('Por favor verifica tu correo');
                }
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
