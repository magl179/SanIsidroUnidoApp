import { Component, OnInit, ViewChild } from '@angular/core';
import { MenuManagedService } from '../../services/menu-managed.service';
import { NavController } from '@ionic/angular';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { UtilsService } from 'src/app/services/utils.service';
import { timer } from 'rxjs';
import { AuthService } from '../../services/auth.service';

const urlLogueado = '/social-problems';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

    @ViewChild('passwordEyeLogin') passwordEye;
    passwordTypeInput = 'password';
    iconpassword = 'eye-off';

    loadingLogin: any;
    loginForm: FormGroup;
    errorMessages = null;
    loginFormFields = {
        email: {
            required: true,
            minlength: 3,
            maxlength: 15
        },
        password: {
            required: true,
            minlength: 8,
            maxlength: 30
        }
    };

    constructor(
        public formBuilder: FormBuilder,
        private menuManagedService: MenuManagedService,
        private navCtrl: NavController,
        private utilsService: UtilsService,
        private authService: AuthService
    ) {
        this.crearFormulario();
        this.cargarMensajesError();
    }

    async ngOnInit() {
        await this.menuManagedService.desactivarMenu();
    }

    togglePasswordMode() {
        this.passwordTypeInput = this.passwordTypeInput === 'text' ? 'password' : 'text';
        this.iconpassword = this.iconpassword === 'eye-off' ? 'eye' : 'eye-off';
        console.log(this.passwordEye);
        this.passwordEye.el.setFocus();
    }

    async iniciarSesion() {
        const loadingLoginValidation = await this.utilsService.createBasicLoading('Validando');
        loadingLoginValidation.present();
        // this.utilsService.mostrarToast(JSON.stringify(this.loginForm.value), 6000);
        // email - password
        // alert(JSON.stringify(this.loginForm.value));
        console.log(this.loginForm.value);
        timer(1500).subscribe(() => {
            loadingLoginValidation.dismiss();
            if (this.authService.login(this.loginForm.value.email, this.loginForm.value.password)) {
                this.navCtrl.navigateRoot('/social-problems');
            } else {
                this.utilsService.mostrarToast('Fallo Iniciar Sesión');
            }
        });
    }
    async iniciarSesionFacebook() {
        const loadingFB = await this.utilsService.createBasicLoading('Validando');
        loadingFB.present();
        timer(1500).subscribe(() => {
            loadingFB.dismiss();
            this.navCtrl.navigateRoot('/social-problems');
        });
    }
    async iniciarSesionGoogle() {
        const loadingGoogle = await this.utilsService.createBasicLoading('Validando');
        loadingGoogle.present();
        await timer(1500).subscribe(() => {
            loadingGoogle.dismiss();
            this.navCtrl.navigateRoot('/social-problems');
        });
    }

    // Función Crea el Formulario
    crearFormulario() {
        // Campo Email
        const emailInput = new FormControl('', Validators.compose([
            Validators.required,
            // Validators.minLength(this.loginFormFields.email.minlength),
            // Validators.maxLength(this.loginFormFields.email.maxlength),
            Validators.email
        ]));
        // Campo Contraseña
        const passwordInput = new FormControl('', Validators.compose([
            Validators.required,
            // Validators.minLength(this.loginFormFields.password.minlength),
            // Validators.maxLength(this.loginFormFields.password.maxlength)
        ]));
        // Añado Propiedades al Form
        this.loginForm = this.formBuilder.group({
            email: emailInput,
            password: passwordInput
        });
    }

    cargarMensajesError() {
        this.errorMessages = {
            email: {
                required: {
                    message: 'El Email es Obligatorio'
                },
                minlength: {
                    message: `El Email debe contener minimo ${this.loginFormFields.email.minlength} caracteres`
                },
                maxlength: {
                    message: `El Email debe contener máximo ${this.loginFormFields.email.maxlength} caracteres`
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
                    message: `La Contraseña debe contener minimo ${this.loginFormFields.password.minlength} caracteres`
                },
                maxlength: {
                    message: `La Contraseña debe contener máximo ${this.loginFormFields.password.maxlength} caracteres`
                }
            }
        };

    }
}
