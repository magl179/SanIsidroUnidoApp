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
import { setInputFocus } from 'src/app/helpers/utils';
import { HttpErrorResponse } from '@angular/common/http';
import { CONFIG } from 'src/config/config';
import { ErrorService } from 'src/app/services/error.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

    @ViewChild('passwordEyeLogin', { read: ElementRef }) passwordEye: ElementRef;
    @ViewChild('first_field', { read: ElementRef }) first_field: ElementRef;
    appNetworkConnection = false;
    passwordTypeInput = 'password';
    loginForm: FormGroup;
    errorMessages = null;
    backUrl: string;

    constructor(
        public formBuilder: FormBuilder,
        private errorService: ErrorService,
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
        this.backUrl = `/home-screen`;
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
        this.loginForm.reset();
        //Redirigir Usuario
        loadingManageLogin.dismiss();
        setTimeout(()=>{
            this.navCtrl.navigateRoot(`/${CONFIG.HOME_ROUTE}`);
        }, 500);
    }

    async loginUser() {
        const loadingLoginValidation = await this.utilsService.createBasicLoading('Validando Credenciales');
        loadingLoginValidation.present();
        const email = this.loginForm.value.email;
        const password = this.loginForm.value.password;
        const loginData = { email, password, provider: 'formulario', device: null };
        //Añadir informacion dispositivo
        const device = await this.notificationsService.getOneSignalIDSubscriptor();
        loginData.device = device;
        //Funcion Login
        this.authService.login(loginData).pipe(
            finalize(() => {
                loadingLoginValidation.dismiss()
            })
        ).subscribe((res: IRespuestaApiSIU) => {
            this.manageLogin(loginData, res);
        }, (err: HttpErrorResponse) => {
            this.errorService.manageHttpError(err, 'Ocurrio un error, intentalo más tarde')
        });
    }

    async loginUserByFB() {
        await this.socialDataService.loginByFacebook();
        this.socialDataService.fbLoginData.subscribe(async fbData => {
            if (fbData) {
                const user = this.socialDataService.getFacebookDataParsed(fbData);
                const { social_id, email } = user;
                //Añadir informacion dispositivo
                const device = await this.notificationsService.getOneSignalIDSubscriptor();
                user.device = device;
                //Funcion Login
                this.authService.login(user).subscribe(res => {
                    this.manageLogin({ provider: 'facebook', social_id, email }, res);
                }, (err: HttpErrorResponse) => {
                    this.errorService.manageHttpError(err, 'Fallo la conexión con Facebook');
                });
            }
        }, (err: HttpErrorResponse) => {
            this.errorService.manageHttpError(err, 'Fallo la conexión con Facebook');
        });
    }

    async loginUserByGoogle() {
        await this.socialDataService.loginByGoogle();
        this.socialDataService.googleLoginData.subscribe(async googleData => {
            if (googleData) {
                const user = this.socialDataService.getGoogleDataParsed(googleData);
                const { social_id, email } = user;
                //Añadir informacion dispositivo
                const device = await this.notificationsService.getOneSignalIDSubscriptor();
                user.device = device;
                //Funcion Login
                this.authService.login(user).subscribe(async res => {
                    await this.manageLogin({ social_id, email, provider: 'google' }, res);
                }, (err: HttpErrorResponse) => {
                    this.errorService.manageHttpError(err, 'Ocurrio un error al conectar con Google');
                });
            }
        }, (err: HttpErrorResponse) => {
            this.errorService.manageHttpError(err, 'Fallo la conexión con Google');
        });
    }

    forgotPassword(){
        this.utilsService.openInBrowser(`${environment.BASEURL}/password/reset`)
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

    //Funcion para navegar a pagina de registro
    goToRegister() {
        this.navCtrl.navigateForward('/register', { animated: true });
    }


}
