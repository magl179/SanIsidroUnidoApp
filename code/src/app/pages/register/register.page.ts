import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { MenuManagedService } from '../../services/menu-managed.service';
import { UtilsService } from 'src/app/services/utils.service';
import { timer } from 'rxjs';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

@Component({
    selector: 'app-register',
    templateUrl: './register.page.html',
    styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
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
        private menuManagedService: MenuManagedService
    ) {
        this.crearFormulario();
        this.cargarMensajesError();
    }

    async ngOnInit() {
        await this.menuManagedService.desactivarMenu();
        this.loadingRegister = await this.utilsService.createBasicLoading('Validando');
    }


    async registrarUsuario() {
        this.loadingRegister.present();
        timer(1500).subscribe(() => {
            this.loadingRegister.dismiss();
            this.navCtrl.navigateRoot('/social-problems');
        });
    }

    async registrarUsuarioFacebook() {
        const fbloading = await this.utilsService.createBasicLoading('Validando');
        fbloading.present();
        timer(1500).subscribe(() => {
            fbloading.dismiss();
            this.navCtrl.navigateRoot('/social-problems');
        });
    }
    async registrarUsuarioGoogle() {
        const googleloading = await this.utilsService.createBasicLoading('Validando');
        googleloading.present();
        await timer(1500).subscribe(() => {
            googleloading.dismiss();
            this.navCtrl.navigateRoot('/social-problems');
        });
    }

    // Función Crea el Formulario
    crearFormulario() {
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
            Validators.minLength(this.registerFormFields.email.minlength),
            Validators.maxLength(this.registerFormFields.email.maxlength),
            Validators.email
        ]));
        // Campo Contraseña
        const passwordInput = new FormControl('', Validators.compose([
            Validators.required,
            Validators.minLength(this.registerFormFields.password.minlength),
            Validators.maxLength(this.registerFormFields.password.maxlength),
            Validators.pattern(this.registerFormFields.password.pattern)
        ]));
        // Añado Propiedades al Form
        this.registerForm = this.formBuilder.group({
            firstname: firstnameInput,
            lastname: lastnameInput,
            email: emailInput,
            password: passwordInput
        });
    }

    cargarMensajesError() {
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
