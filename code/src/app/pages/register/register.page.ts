import { Component, OnInit, ViewChild } from '@angular/core';
// import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { UtilsService } from 'src/app/services/utils.service';
import { timer } from 'rxjs';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-register',
    templateUrl: './register.page.html',
    styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
    @ViewChild('passwordEyeRegister') passwordEye;
    passwordTypeInput = 'password';
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
            maxlength: 30
        },
        password: {
            required: true,
            minlength: 8,
            maxlength: 35,
            pattern: '((?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,30})'
        }
    };
    loadingRegister: any;
    constructor(
        private navCtrl: NavController,
        public formBuilder: FormBuilder,
        private utilsService: UtilsService,
        private authService: AuthService
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
            if (this.authService.register(firstname, lastname, email, password)) {
                this.navCtrl.navigateRoot('/social-problems');
            } else {
                this.utilsService.showToast('Fallo Registrar Usuario');
            }
        });
    }

    async registerFBUser() {
        const fbloading = await this.utilsService.createBasicLoading('Validando');
        // LLamar Metodo Obtener Datos FB User
        // en caso tener dato fb llamar a api mandando datos y esperar que me devuelva usuario registrado
        // Si se registro redirigir a social problem
        // En caso error mostrar toast comunicando error
        fbloading.present();
        timer(1500).subscribe(() => {
            fbloading.dismiss();
            this.navCtrl.navigateRoot('/social-problems');
        });
    }
    async registerGoogleUser() {
        const googleloading = await this.utilsService.createBasicLoading('Validando');
        // LLamar Metodo Obtener Datos FB User
        // en caso tener dato fb llamar a api mandando datos y esperar que me devuelva usuario registrado
        // Si se registro redirigir a social problem
        // En caso error mostrar toast comunicando error
        googleloading.present();
        await timer(1500).subscribe(() => {
            googleloading.dismiss();
            this.navCtrl.navigateRoot('/social-problems');
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
            Validators.email
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
                maxlength: {
                    message: `El Email debe contener máximo ${this.registerFormFields.email.maxlength} caracteres`
                },
                email: {
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
                maxlength: {
                    message: `La Contraseña debe contener máximo ${this.registerFormFields.password.maxlength} caracteres`
                },
                pattern: {
                    message: `Ingresa una contraseña segura`
                }
            }
        };

    }
}
