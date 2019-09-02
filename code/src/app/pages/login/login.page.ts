import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { UtilsService } from 'src/app/services/utils.service';
import { timer } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { SocialDataService } from 'src/app/services/social-data.service';
import { LocalDataService } from '../../services/local-data.service';
import { finalize } from 'rxjs/operators';
import { NetworkService } from '../../services/network.service';
import { NotificationsService } from 'src/app/services/notifications.service';



const urlLogueado = '/home';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

    @ViewChild('passwordEyeLogin') passwordEye;
    appNetworkConnection = false;
    // apphasConnection = false;
    // loginData = {
    //     token: null,
    //     user: null
    // };

    passwordTypeInput = 'password';
    iconpassword = 'eye-off';

    //loadingLogin: any;
    loginForm: FormGroup;
    errorMessages = null;

    constructor(
        public formBuilder: FormBuilder,
        private navCtrl: NavController,
        private utilsService: UtilsService,
        private authService: AuthService,
        private socialDataService: SocialDataService,
        private localDataService: LocalDataService,
        private networkService: NetworkService,
        private notificationsService: NotificationsService
    ) {
        this.createForm();
        //this.loadErrorMessages();
    }

    async ngOnInit() {
        this.networkService.getNetworkStatus().subscribe((connected: boolean) => {
            this.appNetworkConnection = connected;
        });
        await this.utilsService.disabledMenu();
    }

    togglePasswordMode() {
        this.passwordTypeInput = this.passwordTypeInput === 'text' ? 'password' : 'text';
        this.iconpassword = this.iconpassword === 'eye-off' ? 'eye' : 'eye-off';
        // console.log(this.passwordEye);
        this.passwordEye.el.setFocus();
    }

    async manageLogin(loginData, res) {
        //Obtener Token y Usuario
        const token = res.data; 
        const tokendescrifrado = this.authService.decodeToken(token);
        //Guardar Datos Token
        await this.authService.setUserLocalStorage(tokendescrifrado);
        await this.authService.setTokenLocalStorage(token);
        //Registrar Dispositivo
        await this.notificationsService.registerUserDevice();
        //Redirigir Usuario
        this.navCtrl.navigateRoot('/home');
        // this.authService.login(loginData, true).subscribe(async res => {
        //     console.log('login token descifrado', res);
        //     if (res.code === 200) {
        //         this.loginData.user = res.data;
        //         await this.authService.setUserLocalStorage(this.loginData.user);
        //         await this.authService.setTokenLocalStorage(this.loginData.token);
        //         await this.notificationsService.registerUserDevice();
        //         this.navCtrl.navigateRoot('/home');
        //     } else {
        //         this.utilsService.showToast('Fallo Iniciar Sesión 2'); 
        //     }
        // }, err => {
        //     this.utilsService.showToast(`Error: ${err.error.message}`);
        //     console.log('Error Login', err);
        // });
    }
   
    async loginUser() {
        const loadingLoginValidation = await this.utilsService.createBasicLoading('Validando');
        loadingLoginValidation.present();
        const email = this.loginForm.value.email;
        const password = this.loginForm.value.password;
        const loginData = { email, password, provider: 'formulario' };
        await this.authService.login(loginData).pipe(
            finalize(() => {
                loadingLoginValidation.dismiss()
            })
        ).subscribe(res => {
                // console.log('Login First Response', res);
                //if (res.code === 200) {
                    this.manageLogin(loginData, res);
                //} //
            }, err => {
                this.utilsService.showToast(`Error: ${err.error.message}`);
                console.log('Error Login', err.error);
            });
    }

    async loginUserByFB() {
            await this.socialDataService.loginByFacebook();
            await this.socialDataService.fbLoginData.subscribe(async fbData => {
                if (fbData) {
                    const user = this.socialDataService.getFacebookDataParsed(fbData);
                    const { social_id, email } = user;
                    await this.authService.login(user).subscribe(res => {
                            this.manageLogin({provider: 'facebook', social_id, email} , res);
                    }, err => {
                        this.utilsService.showToast(`Error: ${err.error.message}`);
                        console.log('Error Login', err.error);
                    });
                }
            }, async err => {
                await this.utilsService.showToast('Fallo Iniciar Sesión con Facebook');
                console.log('Error Login', err);
            });
    }

    async loginUserByGoogle() {
                await this.socialDataService.loginByGoogle();
                await this.socialDataService.googleLoginData.subscribe(async googleData => {
                    if (googleData) {
                        const user = this.socialDataService.getGoogleDataParsed(googleData);
                        const { social_id, email } = user;
                        await this.authService.login(user).subscribe(async res => {
                            console.log('Login First Response', res);
                                await this.manageLogin({social_id, email, provider: 'google'} , res);
                        }, err => {
                            this.utilsService.showToast(`Error: ${err.error.message}`);
                            console.log('Error Login', err.error);
                        });
                    }
                }, async err => {
                    await this.utilsService.showToast('Fallo Iniciar Sesión con Google');
                    console.log('Error Login', err);
                });
        }

    // Función Crea el Formulario
    createForm() {
        //Cargar Validaciones
        const validations = this.localDataService.getFormValidations();
        // Campo Email
        const email = new FormControl('', Validators.compose([
            Validators.required,    
            Validators.email
        ]));
        // Campo Contraseña
        const password= new FormControl('', Validators.compose([
            Validators.required
        ]));
        // Añado Propiedades al Form
        this.loginForm = this.formBuilder.group({ email, password });
         // Cargo Mensajes de Validaciones
        this.errorMessages = this.localDataService.getFormMessagesValidations(validations);
    }

    
}
