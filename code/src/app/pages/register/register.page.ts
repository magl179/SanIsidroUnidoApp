import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular';
import { UtilsService } from 'src/app/services/utils.service';
import { timer } from 'rxjs';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { SocialDataService } from '../../services/social-data.service';
import { LocalDataService } from '../../services/local-data.service';
import { finalize } from 'rxjs/operators';

const urlLogueado = '/home';

@Component({
    selector: 'app-register',
    templateUrl: './register.page.html',
    styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
    @ViewChild('passwordEyeRegister') passwordEye;
    passwordTypeInput = 'password';
    passwordStrength = '';
    iconpassword = 'eye-off';
    registerForm: FormGroup;
    errorMessages = null;

    constructor(
        private navCtrl: NavController,
        public formBuilder: FormBuilder,
        private utilsService: UtilsService,
        private authService: AuthService,
        private socialDataService: SocialDataService,
        private localDataService: LocalDataService
    ) {
        this.createForm();
    }

    async ngOnInit() {
        await this.utilsService.disabledMenu();
    }

    togglePasswordMode() {
        this.passwordTypeInput = this.passwordTypeInput === 'text' ? 'password' : 'text';
        this.iconpassword = this.iconpassword === 'eye-off' ? 'eye' : 'eye-off';
        console.log(this.passwordEye);
        this.passwordEye.el.setFocus();
    }

    async manageRegister() {
        await this.utilsService.showToast("Registro Correcto, por favor inicia sesión");
        this.navCtrl.navigateRoot('/login');
    }

    async registerUser() {
        const loadingRegisterValidation = await this.utilsService.createBasicLoading('Registrando Usuario');
        loadingRegisterValidation.present();
        console.log(this.registerForm.value);
        // timer(1500).subscribe(() => {
        const firstname = this.registerForm.value.firstname;
        const lastname = this.registerForm.value.lastname;
        const email = this.registerForm.value.email;
        const password = this.registerForm.value.password;
        // loadingRegisterValidation.dismiss();
        this.authService.register('formulario', { firstname, lastname, email, password, socialID: null }).pipe(
            finalize(() => {
                // console.log('login form complete subscribe');
                loadingRegisterValidation.dismiss()
            })
        ).subscribe(async res => { 
            if (res.code === 200) {
                await this.manageRegister();
            }
        }, err => {
            this.utilsService.showToast(err.error.message);
            console.log('Error Login', err.error);
        });
        // });
    }

    async registerFBUser() {
        await this.socialDataService.loginByFacebook();
        await this.socialDataService.fbLoginData.subscribe(async fbData => {
            if (fbData) {
                const user = await this.socialDataService.getDataFacebookParsed(fbData);
                await this.authService.register('facebook', user).subscribe(async registerData => {
                    if (registerData) {
                        this.manageRegister();
                        // await this.setLoginUserData(registerData);
                    }
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
                const user = await this.socialDataService.getDataGoogleParsed(googleData);
                await this.authService.register('google', user).subscribe(async registerData => {
                    // await this.setLoginUserData(registerData);
                    this.manageRegister();
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
            Validators.required,
            Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,20}$/)
        ]));
        // Añado Propiedades al Forms
        this.registerForm = this.formBuilder.group({ firstname, lastname, email, password });
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
