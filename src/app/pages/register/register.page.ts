import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular';
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
import { SocialEmailLoginModal } from 'src/app/modals/social-email-login/social-email-login.modal';

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
        private notificationsService: NotificationsService,
        private modalCtrl: ModalController
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

    async manageRegister(res) {
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
        setTimeout(() => {
            this.navCtrl.navigateRoot(`/${CONFIG.HOME_ROUTE}`);
        }, 900);
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
                loadingRegisterValidation.dismiss();
            })
        ).subscribe(async res => {
            this.authService.setMethodLogin('formulario');
            await this.manageRegister(res);
        }, (error_http: HttpErrorResponse) => {
            this.errorService.manageHttpError(error_http, 'Ocurrio un error al completar el registro');
        });
    }
    //Function para registrar usuario con Facebook
    async registerFBUser() {
        const fbData = await this.socialDataService.loginByFacebook();
        if (fbData) {

            //Verificar Email
            if (!fbData.email) {
                const email = await this.presentModalSocialLogin();
                if (!email) {
                    this.messagesService.showError('Sin una dirección de correo no puedes registrarte');
                    return;
                }
                fbData.email = email;
            }
            const user = this.socialDataService.getFacebookDataMapped(fbData);
            //Añadir informacion dispositivo
            const device = await this.notificationsService.getOneSignalIDSubscriptor();
            user.device = device;
            this.messagesService.showInfo('Verificando las credenciales')
            //Funcion Registro
            this.authService.register(user).subscribe(async res => {
                this.authService.setMethodLogin('facebook');
                await this.manageRegister(res);
            }, (error_http: HttpErrorResponse) => {
                this.errorService.manageHttpError(error_http, 'Ocurrio un error en el registro, intentalo más tarde');
            });
        } else {
            this.messagesService.showError('No se pudo obtener los datos por medio de Facebook');
        }

    }
    // Función para registrar al usuario con Google
    async registerGoogleUser() {
        const googleData = await this.socialDataService.loginByGoogle();
        if (googleData) {

            //Verificar Email
            if (!googleData.email) {
                const email = await this.presentModalSocialLogin();
                if (!email) {
                    this.messagesService.showError('Sin una dirección de correo no puedes registrarte');
                    return;
                }
                googleData.email = email;
            }
            this.messagesService.showInfo('Verificando las credenciales')
            const user = this.socialDataService.getGoogleDataMapped(googleData);
            //Añadir informacion dispositivo
            const device = await this.notificationsService.getOneSignalIDSubscriptor();
            user.device = device;
            //Funcion Registro
            this.authService.register(user).subscribe(async res => {
                this.authService.setMethodLogin('google');
                await this.manageRegister(res);
            }, (error_http: HttpErrorResponse) => {
                this.errorService.manageHttpError(error_http, 'No se pudo completar el registro, intentalo mas tarde');
            });
        } else {
            this.messagesService.showError('No se pudo obtener los datos por medio de Google');
        }
    }

    async presentModalSocialLogin(): Promise<string> {
        const modal = await this.modalCtrl.create({
            component: SocialEmailLoginModal,
            componentProps: {
                title: 'Registro Social'
            },
            backdropDismiss: false
        });
        await modal.present();
        const data: any = await modal.onWillDismiss();
        const email = (data && data.email) ? data.email : null;
        return email;
    }

    preventEnterPressed($event: KeyboardEvent): void {
        $event.preventDefault()
        $event.stopPropagation()
      }

    // Función Crea el Formulario
    createForm() {
        const patronContraseñaSinCaracterEspecial = /^(?=\D*\d)(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z]).{8,100}$/;
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
        this.navCtrl.navigateRoot('/login', { animated: true });
    }

}
