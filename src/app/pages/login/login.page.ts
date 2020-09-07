import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { UtilsService } from 'src/app/services/utils.service';
import { AuthService } from 'src/app/services/auth.service';
import { SocialDataService } from 'src/app/services/social-data.service';
import { LocalDataService } from 'src/app/services/local-data.service';
import { finalize } from 'rxjs/operators';
import { NetworkService } from 'src/app/services/network.service';
import { NotificationsService } from 'src/app/services/notifications.service';
import { IRespuestaApiSIU, IFacebookApiUser } from "src/app/interfaces/models";
import { decodeToken } from 'src/app/helpers/auth-helper';
import { setInputFocus } from 'src/app/helpers/utils';
import { HttpErrorResponse } from '@angular/common/http';
import { CONFIG } from 'src/config/config';
import { ErrorService } from 'src/app/services/error.service';
import { environment } from 'src/environments/environment';
import { MessagesService } from 'src/app/services/messages.service';
import { SocialEmailLoginModal } from 'src/app/modals/social-email-login/social-email-login.modal';

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
    backUrl: string = `/home-screen`;

    constructor(
        public formBuilder: FormBuilder,
        private errorService: ErrorService,
        private navCtrl: NavController,
        private utilsService: UtilsService,
        private authService: AuthService,
        private modalCtrl: ModalController,
        private socialDataService: SocialDataService,
        private localDataService: LocalDataService,
        private messageService: MessagesService,
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

    async manageLogin(res) {
        //Obtener Token y Usuario
        const loadingManageLogin = await this.utilsService.createBasicLoading('Obteniendo Respuesta');
        loadingManageLogin.present();
        const token = res.data;
        const token_decoded = decodeToken(token);
        //Guardar Datos Token
        this.authService.saveLocalStorageInfo(token, token_decoded);
        this.authService.saveUserInfo(token, token_decoded);
        //Registrar Dispositivo
        this.loginForm.reset();
        //Redirigir Usuario
        loadingManageLogin.dismiss();
        this.navCtrl.navigateRoot(`/${CONFIG.HOME_ROUTE}`);
    }

    async loginUser() {
        const loadingLoginValidation = await this.utilsService.createBasicLoading('Validando Credenciales');
        loadingLoginValidation.present();
        const email = this.loginForm.value.email.trim();
        const password = this.loginForm.value.password.trim();
        const loginData = { email, password, provider: 'formulario', device: null };
        //Añadir informacion dispositivo
        const device = await this.notificationsService.getOneSignalIDSubscriptor();
        loginData.device = device;
        //Funcion Login
        this.authService.login(loginData)
        .pipe(
            finalize(() => {
                loadingLoginValidation.dismiss()
            })
        ).subscribe((res: IRespuestaApiSIU) => {
            this.authService.setMethodLogin('formulario');
            this.manageLogin(res);
        }, (error_http: HttpErrorResponse) => {
            console.log('error_http', error_http)
            this.errorService.manageHttpError(error_http, 'Ocurrio un error, intentalo más tarde')
        });
    }

    async presentModalSocialLogin(): Promise<string>{
        const modal = await this.modalCtrl.create({
            component: SocialEmailLoginModal,
            componentProps: {
                title: 'Login Social'
            },
            backdropDismiss: false
        });
        await modal.present();
        const { data } : any = await modal.onWillDismiss();
        const email = (data && data.email) ? data.email : null;
        return email;
    }

    async loginUserByFB(): Promise<void> {
        this.messageService.showInfo('Conectando con facebook ...');
        const fbData = await this.socialDataService.loginByFacebook();
        if (fbData) {
            //Verificar Email
            if(!fbData.email){
                const email = await this.presentModalSocialLogin();
                if(!email){
                    this.messageService.showError('Sin una dirección de correo no puedes iniciar sesión');
                    return
                }
                fbData.email = email;
            }

            const user = this.socialDataService.getFacebookDataMapped(fbData);
            const { social_id, email } = user;
            //Añadir informacion dispositivo
            const device = await this.notificationsService.getOneSignalIDSubscriptor();
            user.device = device;
            //Funcion Login
            this.messageService.showInfo('Verificando las credenciales')
            this.authService.login(user).subscribe(res => {
                this.authService.setMethodLogin('facebook');
                this.manageLogin(res);
            }, (error_http: HttpErrorResponse) => {
                this.errorService.manageHttpError(error_http, 'Fallo la conexión con Facebook');
            });
        } else {
            this.messageService.showError('No se pudo obtener los datos por medio de Facebook');
        }
    }

    async loginUserByGoogle(): Promise<void>  {
        this.messageService.showInfo('Conectando con Google ...');
        const googleData = await this.socialDataService.loginByGoogle();
        if (googleData) {

             //Verificar Email
             if(!googleData.email){
                const email = await this.presentModalSocialLogin();
                if(!email){
                    this.messageService.showError('Sin una dirección de correo no puedes iniciar sesión');
                    return
                }
                googleData.email = email;
            }

            const user = this.socialDataService.getGoogleDataMapped(googleData);
            //Añadir informacion dispositivo
            const device = await this.notificationsService.getOneSignalIDSubscriptor();
            user.device = device;
            //Funcion Login
            this.messageService.showInfo('Verificando las credenciales')
            this.authService.login(user).subscribe(async res => {
                this.authService.setMethodLogin('google');
                await this.manageLogin(res);
            }, (error_http: HttpErrorResponse) => {
                this.errorService.manageHttpError(error_http, 'Ocurrio un error al conectar con Google');
            });
        } else {
            this.messageService.showError('No se pudo obtener los datos por medio de Google');
        }

    }

    preventEnterPressed($event: KeyboardEvent): void {
        $event.preventDefault()
        $event.stopPropagation()
      }

    forgotPassword() {
        this.utilsService.openInBrowser(`${environment.BASEURL}/password/reset`)
    }

    // Función Crea el Formulario
    createForm() {
        //Cargar Validaciones
        const validations = this.localDataService.getFormValidations();
        // Campo Email
        const email = new FormControl('', Validators.compose([
            Validators.required,
            Validators.email,
            Validators.maxLength(validations.email.maxlength)
        ]));
        // Campo Contraseña
        const password = new FormControl('', Validators.compose([
            Validators.required,
            Validators.maxLength(validations.password.maxlength)
        ]));
        // Añado Propiedades al Form
        this.loginForm = this.formBuilder.group({ email, password });
        // Cargo Mensajes de Validaciones
        this.errorMessages = this.localDataService.getFormMessagesValidations(validations);
    }

    //Funcion para navegar a pagina de registro
    goToRegister() {
        this.navCtrl.navigateRoot('/register', { animated: true });
    }


}
