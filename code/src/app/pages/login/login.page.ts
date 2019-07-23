import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { UtilsService } from 'src/app/services/utils.service';
import { timer } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { SocialDataService } from 'src/app/services/social-data.service';

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
            maxlength: 15,
            // tslint:disable-next-line: max-line-length
            pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        },
        password: {
            required: true,
            minlength: 8,
            maxlength: 30
        }
    };

    constructor(
        public formBuilder: FormBuilder,
        private navCtrl: NavController,
        private utilsService: UtilsService,
        private authService: AuthService,
        private socialDataService: SocialDataService
    ) {
        this.createForm();
        this.loadErrorMessages();
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

    async setLoginUserData(user) {
        await this.authService.setUser(user);
        const tokenID = user.tokenID;
        await this.authService.setToken(tokenID);
        this.navCtrl.navigateRoot(urlLogueado);
    }

    async loginUser() {
        const loadingLoginValidation = await this.utilsService.createBasicLoading('Validando');
        loadingLoginValidation.present();
        // console.log(this.loginForm.value);
        timer(1500).subscribe(async () => {
            loadingLoginValidation.dismiss();
            const email = this.loginForm.value.email;
            const password = this.loginForm.value.password;
            await this.authService.login('formulario', { email, password, token_id: null }).subscribe(async data => {
                if (data) {
                    data.tokenID = '2312321323123';
                    await this.setLoginUserData(data);
                }
            }, err => {
                this.utilsService.showToast('Fallo Iniciar Sesión');
                console.log('Error Login', err);
            });
        });
    }

    /*loginUserByGoogleWeb(){
        this.socialDataService.loginByGoogleWeb();
    }*/

    async loginUserByFB() {
            await this.socialDataService.loginByFacebook();
            this.socialDataService.fbLoginData.subscribe(fbData => {
                if (fbData) {
                    const user = this.socialDataService.getDataFacebookParsed(fbData);
                    this.authService.login('facebook', user).subscribe(loginData => {
                        this.setLoginUserData(loginData);
                    });
                }
            }, err => {
                this.utilsService.showToast('Fallo Iniciar Sesión con Facebook');
                console.log('Error Login', err);
            });
    }
    async loginUserByGoogle() {
                await this.socialDataService.loginByGoogle();
                this.socialDataService.googleLoginData.subscribe(async googleData => {
                    if (googleData) {
                        const user = this.socialDataService.getDataGoogleParsed(googleData);
                        await this.authService.login('google', user).subscribe(loginData => {
                            this.setLoginUserData(loginData);
                        });
                    }
                }, err => {
                    this.utilsService.showToast('Fallo Iniciar Sesión con Google');
                    console.log('Error Login', err);
                });
        }

    // Función Crea el Formulario
    createForm() {
        // Campo Email
        const emailInput = new FormControl('', Validators.compose([
            Validators.required,
            Validators.pattern(this.loginFormFields.email.pattern)
        ]));
        // Campo Contraseña
        const passwordInput = new FormControl('', Validators.compose([
            Validators.required,
        ]));
        // Añado Propiedades al Form
        this.loginForm = this.formBuilder.group({
            email: emailInput,
            password: passwordInput
        });
    }

    loadErrorMessages() {
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
                pattern: {
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
