import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NavController } from '@ionic/angular';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { UtilsService } from 'src/app/services/utils.service';
import { AuthService } from 'src/app/services/auth.service';
import { SocialDataService } from 'src/app/services/social-data.service';
import { LocalDataService } from 'src/app/services/local-data.service';
import { finalize } from 'rxjs/operators';
import { NetworkService } from 'src/app/services/network.service';
import { NotificationsService } from 'src/app/services/notifications.service';
import { IRespuestaApiSIU } from "src/app/interfaces/models";
import { decodeToken } from 'src/app/helpers/auth-helper';
import { setInputFocus, manageErrorHTTP } from 'src/app/helpers/utils';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

    @ViewChild('passwordEyeLogin', { read: ElementRef }) passwordEye: ElementRef;
    appNetworkConnection = false;
    passwordTypeInput = 'password';
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
    }

    async ngOnInit() {
        this.networkService.getNetworkStatus().subscribe((connected: boolean) => {
            this.appNetworkConnection = connected;
        });
        await this.utilsService.disabledMenu();
    }

    togglePasswordMode() {
        this.passwordTypeInput = this.passwordTypeInput === 'text' ? 'password' : 'text';
        setInputFocus(this.passwordEye);
    }

    async manageLogin(loginData: any, res: any) {
        //Obtener Token y Usuario
        const loadingManageLogin = await this.utilsService.createBasicLoading('Obteniendo Respuesta');
        loadingManageLogin.present();
        const token = res.data;
        const token_decoded = decodeToken(token);
        //Guardar Datos Token
        this.authService.saveUserInfo(token, token_decoded);
        this.authService.saveLocalStorageInfo(token, token_decoded);
        //Registrar Dispositivo
        this.notificationsService.registerUserDevice();
        this.loginForm.reset();
        //Redirigir Usuario
        loadingManageLogin.dismiss();
        this.navCtrl.navigateRoot('/home');
    }

    async loginUser() {
        const loadingLoginValidation = await this.utilsService.createBasicLoading('Validando Credenciales');
        loadingLoginValidation.present();
        const email = this.loginForm.value.email;
        const password = this.loginForm.value.password;
        const loginData = { email, password, provider: 'formulario' };
        this.authService.login(loginData).pipe(
            finalize(() => {
                loadingLoginValidation.dismiss()
            })
        ).subscribe((res: IRespuestaApiSIU) => {
            this.manageLogin(loginData, res);
        }, (err: HttpErrorResponse) => {
            this.utilsService.showToast({
                message: manageErrorHTTP(err, 'Ocurrio un error, intentalo más tarde'),
                color: 'danger'
            });
        });
    }

    async loginUserByFB() {
        await this.socialDataService.loginByFacebook();
        this.socialDataService.fbLoginData.subscribe(async fbData => {
            if (fbData) {
                const user = this.socialDataService.getFacebookDataParsed(fbData);
                const { social_id, email } = user;
                const loginData = {
                    email: user.email,
                    provider: user.provider,
                    social_id: user.social_id
                };
                this.authService.login(loginData).subscribe(res => {
                    this.manageLogin({ provider: 'facebook', social_id, email }, res);
                }, (err: HttpErrorResponse) => {
                    this.utilsService.showToast({
                        message: manageErrorHTTP(err, 'Fallo la conexión con Facebook'),
                        color: 'danger'
                    });
                });
            }
        }, (err: HttpErrorResponse) => {
            this.utilsService.showToast({
                message: manageErrorHTTP(err, 'Fallo la conexión con Facebook'),
                color: 'danger'
            });
        });
    }

    async loginUserByGoogle() {
        await this.socialDataService.loginByGoogle();
        this.socialDataService.googleLoginData.subscribe(async googleData => {
            if (googleData) {
                const user = this.socialDataService.getGoogleDataParsed(googleData);
                const { social_id, email } = user;
                const loginData = {
                    email: user.email,
                    provider: user.provider,
                    social_id: user.social_id
                };
                this.authService.login(loginData).subscribe(async res => {
                    console.log('Login First Response', res);
                    await this.manageLogin({ social_id, email, provider: 'google' }, res);
                }, (err: HttpErrorResponse) => {
                    this.utilsService.showToast({
                        message: manageErrorHTTP(err, 'Ocurrio un error al conectar con Google')
                    });
                });
            }
        }, (err: HttpErrorResponse) => {
            this.utilsService.showToast({
                message: manageErrorHTTP(err, 'Fallo la conexión con Google')
            });
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
        const password = new FormControl('', Validators.compose([
            Validators.required
        ]));
        // Añado Propiedades al Form
        this.loginForm = this.formBuilder.group({ email, password });
        // Cargo Mensajes de Validaciones
        this.errorMessages = this.localDataService.getFormMessagesValidations(validations);
    }


}
