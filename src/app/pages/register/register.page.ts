import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NavController } from '@ionic/angular';
import { UtilsService } from 'src/app/services/utils.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { SocialDataService } from 'src/app/services/social-data.service';
import { LocalDataService } from 'src/app/services/local-data.service';
import { finalize } from 'rxjs/operators';
import { NetworkService } from 'src/app/services/network.service';
import { NotificationsService } from 'src/app/services/notifications.service';
import { decodeToken } from 'src/app/helpers/auth-helper';
import { setInputFocus } from 'src/app/helpers/utils';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { CONFIG } from 'src/config/config';
import { ErrorService } from 'src/app/services/error.service';

@Component({
    selector: 'app-register',
    templateUrl: './register.page.html',
    styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

    @ViewChild('passwordEyeRegister', { read: ElementRef }) passwordEye: ElementRef;
    @ViewChild('first_field', { read: ElementRef }) first_field: ElementRef;
    backUrl: string;
    passwordTypeInput = 'password';
    registerForm: FormGroup;
    errorMessages = null;
    appNetworkConnection = false;

    constructor(
        private navCtrl: NavController,
        private errorService: ErrorService,
        public formBuilder: FormBuilder,
        private utilsService: UtilsService,
        private authService: AuthService,
        private socialDataService: SocialDataService,
        private localDataService: LocalDataService,
        private networkService: NetworkService,
        private notificationsService: NotificationsService
    ) {
        this.createForm();
    }

    // ionViewDidEnter() {
    //     setTimeout(() => {
    //       this.first_field.nativeElement.setFocus();
    //     },150);    
    //  }

    async ngOnInit() {
        this.backUrl = `/home-screen`;
        this.networkService.getNetworkStatus().subscribe((connected: boolean) => {
            this.appNetworkConnection = connected;
        });
        await this.utilsService.disabledMenu();
    }
    //Función alternar modo vista campo contraseña
    togglePasswordMode() {
        this.passwordTypeInput = this.passwordTypeInput === 'text' ? 'password' : 'text';
        setInputFocus(this.passwordEye);
    }

    async manageRegister(loginData, res) {
        //Obtener Token y Usuario
        const loadingManageRegister = await this.utilsService.createBasicLoading('Obteniendo Respuesta');
        loadingManageRegister.present();
        const token = res.data;
        const token_decoded = decodeToken(token);
        //Guardar Datos Token
        this.authService.saveUserInfo(token, token_decoded);
        this.authService.saveLocalStorageInfo(token, token_decoded);
        //Registrar Dispositivo
        this.notificationsService.registerUserDevice(token_decoded.user);
        //Activar notificaciones onesignal
        this.notificationsService.activateOnesignalSubscription();
        // this.notificationsService.setEmailOnesignal(loginData.email);
        //Redirigir Usuario
        loadingManageRegister.dismiss();
        //Redigirir a la ruta HOME
        this.navCtrl.navigateRoot(`/${CONFIG.HOME_ROUTE}`);
    }
    //Function registrar al usuario por formulario
    async registerUser() {
        const loadingRegisterValidation = await this.utilsService.createBasicLoading('Registrando Usuario');
        loadingRegisterValidation.present();
        // Datos Formulario Registro
        const first_name = this.registerForm.value.first_name;
        const last_name = this.registerForm.value.last_name;
        const email = this.registerForm.value.email;
        const password = this.registerForm.value.password;
        const user = {
            first_name, last_name, email, password, social_id: null, provider: 'formulario'
        };
        // Método para registrar al usuario
        this.authService.register(user).pipe(
            finalize(() => {
                loadingRegisterValidation.dismiss()
            })
        ).subscribe(async res => {
            await this.manageRegister({ provider: 'formulario', email, password }, res);
        }, (err: HttpErrorResponse) => {
            this.errorService.manageHttpError(err, 'Ocurrio un error al completar el registro');
        });
    }
    //Function para registrar usuario con Facebook
    async registerFBUser() {
        await this.socialDataService.loginByFacebook();
        this.socialDataService.fbLoginData.subscribe(async fbData => {
            if (fbData) {
                const user = this.socialDataService.getFacebookDataParsed(fbData);
                this.authService.register(user).subscribe(async res => {
                    await this.manageRegister({ email: user.email, social_id: user.social_id, provider: 'facebook' }, res);
                }, (err: HttpErrorResponse) => {
                    this.errorService.manageHttpError(err, 'Ocurrio un error en el registro, intentalo más tarde');
                });
            }
        }, (err: HttpErrorResponse) => {
            this.errorService.manageHttpError(err, 'Fallo la conexión con Facebook');
        });
    }
    // Función para registrar al usuario con Google
    async registerGoogleUser() {
        await this.socialDataService.loginByGoogle();
        this.socialDataService.googleLoginData.subscribe(async googleData => {
            if (googleData) {
                const user = await this.socialDataService.getGoogleDataParsed(googleData);
                this.authService.register(user).subscribe(async res => {
                    await this.manageRegister({ email: user.email, social_id: user.social_id, provider: 'google' }, res);
                }, (err: HttpErrorResponse) => {
                    this.errorService.manageHttpError(err, 'No se pudo completar el registro, intentalo mas tarde');
                });
            }
        }, (err: HttpErrorResponse) => {
            this.errorService.manageHttpError(err, 'Fallo la conexión con Google');
        });
    }

    // Función Crea el Formulario
    createForm() {
        //Cargar Validaciones
        const validations = this.localDataService.getFormValidations();
        // Campo Email
        const first_name = new FormControl('', Validators.compose([
            Validators.required,
            Validators.minLength(validations.first_name.minlength)
        ]));
        // Campo Email
        const last_name = new FormControl('', Validators.compose([
            Validators.required,
            Validators.minLength(validations.last_name.minlength),
        ]));
        // Campo Email
        const email = new FormControl('', Validators.compose([
            Validators.required,
            Validators.email
        ]));
        // Campo Contraseña
        const password = new FormControl('', Validators.compose([
            Validators.required,
            Validators.minLength(validations.password.minlength)
            // Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,20}$/)
        ]));
        // Añado Propiedades al Forms
        this.registerForm = this.formBuilder.group({ first_name, last_name, email, password });
        // Cargo Mensajes de Validaciones
        this.errorMessages = this.localDataService.getFormMessagesValidations(validations);
    }

    //Funcion para navegar a pagina de login
    goToLogin() {
        this.navCtrl.navigateForward('/login', {animated: true});
    }

}
