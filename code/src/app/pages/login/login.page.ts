import { Component, OnInit } from '@angular/core';
import { MenuManagedService } from '../../services/menu-managed.service';
import { NavController} from '@ionic/angular';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { UtilsService } from 'src/app/services/utils.service';
import { timer } from 'rxjs';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
    loadingLogin: any;
    passwordTypeInput = 'password';
    iconpassword = 'eye-off';
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
        private utilsService: UtilsService
    ) {
        this.crearFormulario();
        this.cargarMensajesError();
    }

    async ngOnInit() {
        await this.menuManagedService.desactivarMenu();
        this.loadingLogin = await this.utilsService.createBasicLoading('Validando');
    }

    public togglePasswordMode(): void{
        this.passwordTypeInput = this.passwordTypeInput === 'text' ? 'password' : 'text';
        this.iconpassword = this.iconpassword === 'eye-off' ? 'eye' : 'eye-off';
    }

    async iniciarSesion() {
        this.loadingLogin.present();
        timer(1500).subscribe(() => {
            this.loadingLogin.dismiss();
            this.navCtrl.navigateRoot('/social-problems');
        });
    }
    async iniciarSesionFacebook() {
        this.loadingLogin.present();
        timer(1500).subscribe(() => {
            this.loadingLogin.dismiss();
            this.navCtrl.navigateRoot('/social-problems');
        });
    }
    async iniciarSesionGoogle() {
        this.loadingLogin.present();
        await timer(1500).subscribe(() => {
            this.loadingLogin.dismiss();
            this.navCtrl.navigateRoot('/social-problems');
        });
    }

    // Función Crea el Formulario
    crearFormulario() {
        // Campo Email
        const emailInput = new FormControl('', Validators.compose([
            Validators.required,
            Validators.minLength(this.loginFormFields.email.minlength),
            Validators.maxLength(this.loginFormFields.email.maxlength),
            Validators.email
        ]));
        // Campo Contraseña
        const passwordInput = new FormControl('', Validators.compose([
            Validators.required,
            Validators.minLength(this.loginFormFields.password.minlength),
            Validators.maxLength(this.loginFormFields.password.maxlength)
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
