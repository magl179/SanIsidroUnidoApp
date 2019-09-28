import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular';
import { UtilsService } from 'src/app/services/utils.service';
import { timer } from 'rxjs';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { SocialDataService } from '../../services/social-data.service';
import { LocalDataService } from '../../services/local-data.service';
import { finalize } from 'rxjs/operators';
import { ILoginUser } from '../../interfaces/models';
import { CheckboxValidator } from 'src/app/helpers/checkbox.validator';
import { NetworkService } from '../../services/network.service';
import { NotificationsService } from '../../services/notifications.service';


const urlLogueado = '/home';

@Component({
    selector: 'app-register',
    templateUrl: './register.page.html',
    styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
    @ViewChild('passwordEyeRegister') passwordEye;
    appNetworkConnection = false;

    passwordTypeInput = 'password';
    passwordStrength = '';
    iconpassword = 'eye-off';
    registerForm: FormGroup;
    errorMessages = null;
    // loginData = {
    //     token: null,
    //     user: null
    // };

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
        this.networkService.getNetworkStatus().subscribe((connected: boolean) => {
            this.appNetworkConnection = connected;
        });
        await this.utilsService.disabledMenu();
    }
    //Función alternar modo vista campo contraseña
    togglePasswordMode() {
        this.passwordTypeInput = this.passwordTypeInput === 'text' ? 'password' : 'text';
        this.iconpassword = this.iconpassword === 'eye-off' ? 'eye' : 'eye-off';
        this.passwordEye.el.setFocus();
    }

    async manageRegister(loginData, res) {
        //Obtener Token y Usuario
        const loadingManageRegister = await this.utilsService.createBasicLoading('Obteniendo Respuesta');
        loadingManageRegister.present();
        const token = res.data; 
        const tokendescrifrado = this.authService.decodeToken(token);
        //Guardar Datos Token
        await this.authService.setUserLocalStorage(tokendescrifrado);
        await this.authService.setTokenLocalStorage(token);
        //Registrar Dispositivo
        this.notificationsService.registerUserDevice();
        //Redirigir Usuario
        loadingManageRegister.dismiss();
        this.navCtrl.navigateRoot('/home');
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
                await this.manageRegister({provider: 'formulario', email, password }, res);
        }, err => {
            const message_error = (err.error) ? err.error: 'No se pudo cargar la información del usuario';
            this.utilsService.showToast(message_error);
            console.log('Error Login', err.error);
        });
    }
    //Function para registrar usuario con Facebook
    async registerFBUser() {
        await this.socialDataService.loginByFacebook();
        this.socialDataService.fbLoginData.subscribe(async fbData => {
            if (fbData) {
                const user = this.socialDataService.getFacebookDataParsed(fbData);
                this.authService.register(user).subscribe(async res=> {
                    await this.manageRegister({ email: user.email, social_id: user.social_id, provider: 'facebook'}, res);
                }, err => {
                    const message_error = (err.error.message)?err.error.message: 'No se pudo guardar el registro';
                    this.utilsService.showToast(message_error);
                    console.log('Error Login', message_error);
                });
            }
        }, err => {
            this.utilsService.showToast('Fallo Obtener Datos de Facebook');
            console.log('Error Login', err);
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
                }, err => {
                    const message_error = (err.error.message)?err.error.message: 'No se pudo guardar el registro';
                    this.utilsService.showToast(message_error);
                    console.log('Error Login', message_error);
                });
            }
        }, err => {
            this.utilsService.showToast('Fallo Traer los datos de Google');
            console.log('Error Login', err);
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
        // const termconditions = new FormControl(false, Validators.compose([
        //     CheckboxValidator.isChecked, Validators.required
        // ]));
        // Añado Propiedades al Forms
        this.registerForm = this.formBuilder.group({ firstname, lastname, email, password });
        // Cargo Mensajes de Validaciones
        this.errorMessages = this.localDataService.getFormMessagesValidations(validations);
    }

}
