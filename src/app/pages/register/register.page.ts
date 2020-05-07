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
import { CONFIG } from 'src/config/config';
import { ErrorService } from 'src/app/services/error.service';
import { MessagesService } from 'src/app/services/messages.service';

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
        private messagesService: MessagesService,
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
        const loadingManageRegister = await this.utilsService.createBasicLoading('Obteniendo Respuesta...');
        loadingManageRegister.present();
        const token = res.data;
        const token_decoded = decodeToken(token);
        //Guardar Datos Token
        this.authService.saveUserInfo(token, token_decoded);
        this.authService.saveLocalStorageInfo(token, token_decoded);
        this.messagesService.showSuccess('Usuario Registrado Correctamente');
        //Registrar Dispositivo
        loadingManageRegister.dismiss();
        //Redigirir a la ruta HOME
        setTimeout(()=>{
            this.navCtrl.navigateRoot(`/${CONFIG.HOME_ROUTE}`);
        }, 500);
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
            first_name, last_name, email, password, social_id: null, provider: 'formulario', device: null
        };
        //Añadir informacion dispositivo
        const device = await this.notificationsService.getOneSignalIDSubscriptor();
        user.device = device;
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
                //Añadir informacion dispositivo
                const device = await this.notificationsService.getOneSignalIDSubscriptor();
                user.device = device;
                //Funcion Registro
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
                //Añadir informacion dispositivo
                const device = await this.notificationsService.getOneSignalIDSubscriptor();
                user.device = device;
                //Funcion Registro
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
        const patronContraseñaSinCaracterEspecial = /^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,100}$/;
        //Cargar Validaciones
        const validations = this.localDataService.getFormValidations();
        
        const first_name = new FormControl('', Validators.compose([
            Validators.required,
            Validators.minLength(validations.first_name.minlength),
            Validators.pattern(validations.first_name.pattern)
        ]));
       
        const last_name = new FormControl('', Validators.compose([
            Validators.required,
            Validators.minLength(validations.last_name.minlength),
            Validators.pattern(validations.last_name.pattern)
        ]));
        
        const email = new FormControl('', Validators.compose([
            Validators.required,
            Validators.email
        ]));
      
        const password = new FormControl('', Validators.compose([
            Validators.required,
            Validators.minLength(validations.password.minlength),
            Validators.pattern(patronContraseñaSinCaracterEspecial)
        ]));
        // Añado Propiedades al Forms
        this.registerForm = this.formBuilder.group({ first_name, last_name, email, password });
        // Cargo Mensajes de Validaciones
        this.errorMessages = this.localDataService.getFormMessagesValidations(validations);
    }

    //Funcion para navegar a pagina de login
    goToLogin() {
        this.navCtrl.navigateForward('/login', { animated: true });
    }

}
