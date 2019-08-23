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
    loginData = {
        token: null,
        user: null
    };

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

    togglePasswordMode() {
        this.passwordTypeInput = this.passwordTypeInput === 'text' ? 'password' : 'text';
        this.iconpassword = this.iconpassword === 'eye-off' ? 'eye' : 'eye-off';
        // console.log(this.passwordEye);
        this.passwordEye.el.setFocus();
    }

    async manageRegister(loginData, res) {
        // await this.utilsService.showToast("Has sido registrado correctamente, por favor inicia sesión");
        // this.navCtrl.navigateRoot('/login');
         // console.log('login token cifrado', res);
         this.loginData.token = res.data;
         //Obtener Usuario Identificado
         this.authService.login(loginData, true).subscribe(async res => {
             console.log('login token descifrado', res);
             if (res.code === 200) {
                 this.loginData.user = res.data;
                 await this.authService.setUserLocalStorage(this.loginData.user);
                 await this.authService.setTokenLocalStorage(this.loginData.token);
                 await this.notificationsService.registerUserDevice();
                 this.navCtrl.navigateRoot('/home');
             } else {
                 this.utilsService.showToast('Fallo Iniciar Sesión 2'); 
             }
         }, err => {
             this.utilsService.showToast(err.error.message);
             console.log('Error Login', err);
         });
    }

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
            //if (res.code === 200) {
                await this.manageRegister({provider: 'formulario', email, password }, res);
            //}
        }, err => {
            this.utilsService.showToast(err.error.message);
            console.log('Error Login', err.error);
        });
    }

    goToTermConditions() {
        this.utilsService.openInBrowser('https://www.google.com');
    }

    async registerFBUser() {
        await this.socialDataService.loginByFacebook();
        await this.socialDataService.fbLoginData.subscribe(async fbData => {
            if (fbData) {
                const user = await this.socialDataService.getFacebookDataParsed(fbData);
                await this.authService.register(user).subscribe(async res=> {
                    // if (registerData) {
                        await this.manageRegister({ email: user.email, social_id: user.social_id, provider: 'facebook'}, res);
                        // await this.setLoginUserData(registerData);
                    // }
                }, err => {
                    this.utilsService.showToast(err.error.message);
                    console.log('Error Login', err.error);
                });
            }
        }, err => {
            this.utilsService.showToast('Fallo Obtener Datos de Facebook');
            console.log('Error Login', err);
        });
    }
    async registerGoogleUser() {
        await this.socialDataService.loginByGoogle();
        await this.socialDataService.googleLoginData.subscribe(async googleData => {
            if (googleData) {
                const user = await this.socialDataService.getGoogleDataParsed(googleData);
                await this.authService.register(user).subscribe(async res => {
                    // await this.setLoginUserData(registerData);
                    await this.manageRegister({ email: user.email, social_id: user.social_id, provider: 'google' }, res);
                }, err => {
                    this.utilsService.showToast(err.error.message);
                    console.log('Error Login', err.error);
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
            Validators.minLength(3)
        ]));
        // Campo Email
        const lastname = new FormControl('', Validators.compose([
            Validators.required,
            Validators.minLength(3),
        ]));
        // Campo Email
        const email = new FormControl('', Validators.compose([
            Validators.required,
            Validators.email
        ]));
        // Campo Contraseña
        const password = new FormControl('', Validators.compose([
            Validators.required
            // Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,20}$/)
        ]));
        const termconditions = new FormControl(false, Validators.compose([
            CheckboxValidator.isChecked, Validators.required
        ]));
        // Añado Propiedades al Forms
        this.registerForm = this.formBuilder.group({ firstname, lastname, email, password, termconditions });
        // Cargo Mensajes de Validaciones
        this.errorMessages = this.localDataService.getFormMessagesValidations(validations);
    }

    /*loadErrorMessages(validations) {
        this.errorMessages = {
            firstname: {
                required: {
                    message: 'El Nombre es Obligatorio'
                },
                minlength: {
                    message: `El Nombre debe contener minimo ${validations.firstname.minlength} caracteres`
                },
                maxlength: {
                    message: `El Nombre debe contener máximo ${validations.firstname.maxlength} caracteres`
                }
            },
            lastname: {
                required: {
                    message: 'Los Apellidos son Obligatorios'
                },
                minlength: {
                    message: `Los Apellidos deben contener minimo ${this.registerFormFields.email.minlength} caracteres`
                },
                maxlength: {
                    message: `Los Apellidos deben contener máximo ${this.registerFormFields.email.maxlength} caracteres`
                }
            },
            email: {
                required: {
                    message: 'El Email es Obligatorio'
                },
                minlength: {
                    message: `El Email debe contener minimo ${this.registerFormFields.email.minlength} caracteres`
                },
                pattern: {
                    message: `Ingresa un email válido`
                }
            },
            password: {
                required: {
                    message: 'La Contraseña es obligatoria'
                },
                minlength: {
                    message: `La Contraseña debe contener al menos ${this.registerFormFields.password.minlength} caracteres`
                },
                pattern: {
                    message: `Ingresa una contraseña segura`
                }
            }
        };

    }*/
}
