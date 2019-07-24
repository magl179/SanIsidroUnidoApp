import { Component, OnInit, ViewChild } from '@angular/core';
// import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { UtilsService } from 'src/app/services/utils.service';
import { timer } from 'rxjs';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { SocialDataService } from '../../services/social-data.service';

const urlLogueado = '/social-problems';

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
    registerFormFields = {
        firstname: {
            required: true,
            minlength: 3,
            maxlength: 30
        },
        lastname: {
            required: true,
            minlength: 3,
            maxlength: 30
        },
        email: {
            required: true,
            minlength: 3,
            maxlength: 30,
            // tslint:disable-next-line: max-line-length
            pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        },
        password: {
            required: true,
            minlength: 8,
            maxlength: 35,
            pattern: /((?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,30})/
        }
    };
    loadingRegister: any;
    constructor(
        private navCtrl: NavController,
        public formBuilder: FormBuilder,
        private utilsService: UtilsService,
        private authService: AuthService,
        private socialDataService: SocialDataService
    ) {
        this.createForm();
        this.loadErrorMessages();
    }

    async ngOnInit() {
        await this.utilsService.disabledMenu();
        this.loadingRegister = await this.utilsService.createBasicLoading('Validando');
    }

    togglePasswordMode() {
        this.passwordTypeInput = this.passwordTypeInput === 'text' ? 'password' : 'text';
        this.iconpassword = this.iconpassword === 'eye-off' ? 'eye' : 'eye-off';
        console.log(this.passwordEye);
        this.passwordEye.el.setFocus();
    }

    setLoginUserData(user) {
        this.authService.setUser(user);
        const tokenID = user.tokenID;
        this.authService.setToken(tokenID);
        this.navCtrl.navigateRoot(urlLogueado);
    }

    async registerUser() {
        const loadingRegisterValidation = await this.utilsService.createBasicLoading('Validando');
        loadingRegisterValidation.present();
        console.log(this.registerForm.value);
        timer(1500).subscribe(() => {
            loadingRegisterValidation.dismiss();
            const firstname = this.registerForm.value.firstname;
            const lastname = this.registerForm.value.lastname;
            const email = this.registerForm.value.email;
            const password = this.registerForm.value.password;
            this.authService.register('formulario', { firstname, lastname, email, password, socialID: null }).subscribe(data => {
                if (data) {
                    data.tokenID = '2312321323123';
                    this.setLoginUserData(data);
                }
            }, err => {
                this.utilsService.showToast('Fallo Iniciar Sesión');
                console.log('Error Login', err);
            });
        });
    }

    async registerFBUser() {
        await this.socialDataService.loginByFacebook();
        this.socialDataService.fbLoginData.subscribe(async fbData => {
            if (fbData) {
                const user = this.socialDataService.getDataFacebookParsed(fbData);
                await this.authService.register('facebook', user).subscribe(registerData => {
                    if (registerData) {
                        this.setLoginUserData(registerData);
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
            this.socialDataService.googleLoginData.subscribe(async googleData => {
                if (googleData) {
                        const user = this.socialDataService.getDataGoogleParsed(googleData);
                        await this.authService.register('google', user).subscribe(registerData => {
                            this.setLoginUserData(registerData);
                        });
                  }
            }, err => {
                this.utilsService.showToast('Fallo Traer los datos de Google');
                console.log('Error Login', err);
            });
    }

    // Función Crea el Formulario
    createForm() {
        // Campo Email
        const firstnameInput = new FormControl('', Validators.compose([
            Validators.required,
            Validators.minLength(this.registerFormFields.firstname.minlength),
            Validators.maxLength(this.registerFormFields.firstname.maxlength)
        ]));
        // Campo Email
        const lastnameInput = new FormControl('', Validators.compose([
            Validators.required,
            Validators.minLength(this.registerFormFields.lastname.minlength),
            Validators.maxLength(this.registerFormFields.lastname.maxlength)
        ]));
        // Campo Email
        const emailInput = new FormControl('', Validators.compose([
            Validators.required,
            Validators.pattern(this.registerFormFields.email.pattern)
        ]));
        // Campo Contraseña
        const passwordInput = new FormControl('', Validators.compose([
            Validators.required,
            Validators.minLength(this.registerFormFields.password.minlength),
            Validators.pattern(this.registerFormFields.password.pattern)
        ]));
        // Añado Propiedades al Forms
        this.registerForm = this.formBuilder.group({
            firstname: firstnameInput,
            lastname: lastnameInput,
            email: emailInput,
            password: passwordInput
        });
    }

    loadErrorMessages() {
        this.errorMessages = {
            firstname: {
                required: {
                    message: 'El Nombre es Obligatorio'
                },
                minlength: {
                    message: `El Nombre debe contener minimo ${this.registerFormFields.email.minlength} caracteres`
                },
                maxlength: {
                    message: `El Nombre debe contener máximo ${this.registerFormFields.email.maxlength} caracteres`
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
                    message: 'La Contraseña es Obligatoria'
                },
                minlength: {
                    message: `La Contraseña debe contener minimo ${this.registerFormFields.password.minlength} caracteres`
                },
                pattern: {
                    message: `Ingresa una contraseña segura`
                }
            }
        };

    }
}
