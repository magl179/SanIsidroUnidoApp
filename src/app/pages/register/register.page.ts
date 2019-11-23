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
import { setInputFocus, manageErrorHTTP } from 'src/app/helpers/utils';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-register',
    templateUrl: './register.page.html',
    styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

    @ViewChild('passwordEyeRegister', { read: ElementRef }) passwordEye: ElementRef;
    backUrl: string;
    passwordTypeInput = 'password';
    registerForm: FormGroup;
    errorMessages = null;
    appNetworkConnection = false;

    constructor(
        private navCtrl: NavController,
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
        const loadingManageRegister = await this.utilsService.createBasicLoading('Obteniendo Respuesta');
        loadingManageRegister.present();
        const token = res.data;
        const token_decoded = decodeToken(token);
        //Guardar Datos Token
        this.authService.saveUserInfo(token, token_decoded);
        this.authService.saveLocalStorageInfo(token, token_decoded);
        //Registrar Dispositivo
        this.notificationsService.registerUserDevice();
        //Redirigir Usuario
        loadingManageRegister.dismiss();
        this.navCtrl.navigateRoot(`/${environment.home_route}`);
    }
    //Function registrar al usuario por formulario
    async registerUser() {
        const loadingRegisterValidation = await this.utilsService.createBasicLoading('Registrando Usuario');
        loadingRegisterValidation.present();
        console.log(this.registerForm.value);
        // Datos Formulario Registro
        const firstname = this.registerForm.value.firstname;
        const lastname = this.registerForm.value.lastname;
        const email = this.registerForm.value.email;
        const password = this.registerForm.value.password;
        const user = {
            firstname, lastname, email, password, social_id: null, provider: 'formulario'
        };
        // Método para registrar al usuario
        this.authService.register(user).pipe(
            finalize(() => {
                loadingRegisterValidation.dismiss()
            })
        ).subscribe(async res => {
            await this.manageRegister({ provider: 'formulario', email, password }, res);
        }, (err: HttpErrorResponse) => {
            this.utilsService.showToast({message: manageErrorHTTP(err, 'Ocurrio un error al completar el registro')});
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
                    this.utilsService.showToast({message: manageErrorHTTP(err, 'Ocurrio un error en el registro, intentalo más tarde')});
                });
            }
        }, (err: HttpErrorResponse) => {
            this.utilsService.showToast({message: manageErrorHTTP(err, 'Fallo la conexión con Facebook')});
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
                    this.utilsService.showToast({message: manageErrorHTTP(err, 'No se pudo completar el registro, intentalo mas tarde')});
                });
            }
        }, (err: HttpErrorResponse) => {
            this.utilsService.showToast({message: manageErrorHTTP(err, 'Fallo la conexión con Google')});
        });
    }

    // Función Crea el Formulario
    createForm() {
        //Cargar Validaciones
        const validations = this.localDataService.getFormValidations();
        // Campo Email
        const firstname = new FormControl('', Validators.compose([
            Validators.required,
            Validators.minLength(validations.firstname.minlength)
        ]));
        // Campo Email
        const lastname = new FormControl('', Validators.compose([
            Validators.required,
            Validators.minLength(validations.lastname.minlength),
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
        this.registerForm = this.formBuilder.group({ firstname, lastname, email, password });
        // Cargo Mensajes de Validaciones
        this.errorMessages = this.localDataService.getFormMessagesValidations(validations);
    }

}
