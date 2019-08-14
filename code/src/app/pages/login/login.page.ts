import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { UtilsService } from 'src/app/services/utils.service';
import { timer } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { SocialDataService } from 'src/app/services/social-data.service';


const urlLogueado = '/home';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

    @ViewChild('passwordEyeLogin') passwordEye;
    // apphasConnection = false;
    loginData = {
        token: null,
        user: null
    };

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


    manageLogin(provider, data, res) {
        // console.log('login token cifrado', res);
        this.loginData.token = res.data;
        //Obtener Usuario Identificado
        this.authService.login(provider, data, true).subscribe(async res => {
            console.log('login token descifrado', res);
            if (res.code === 200) {
                this.loginData.user = res.data;
                await this.authService.setUser(this.loginData.user);
                await this.authService.setToken(this.loginData.token);
                this.navCtrl.navigateRoot('/home');
            } else {
                this.utilsService.showToast('Fallo Iniciar Sesión 2'); 
            }
        }, err => {
            this.utilsService.showToast(err.error.message);
            console.log('Error Login', err);
        });
    }
   

    async loginUser() {
        const loadingLoginValidation = await this.utilsService.createBasicLoading('Validando');
        loadingLoginValidation.present();
            const email = this.loginForm.value.email;
            const password = this.loginForm.value.password;
            loadingLoginValidation.dismiss();
            await this.authService.login('formulario', { email, password }).subscribe(res => {
                console.log('Login First Response', res);
                if (res.code === 200) {
                    this.manageLogin('formulario', { email, password }, res);
                } else {
                    this.utilsService.showToast('Fallo Iniciar Sesión 1');
                }
            }, err => {
                this.utilsService.showToast(err.error.message);
                console.log('Error Login', err.error);
            });
    }

    async loginUserByFB() {
            await this.socialDataService.loginByFacebook();
            await this.socialDataService.fbLoginData.subscribe(async fbData => {
                if (fbData) {
                    const user = this.socialDataService.getDataFacebookParsed(fbData);
                    await this.authService.login('facebook', user).subscribe(async loginData => {
                        await this.setLoginUserData(loginData);
                    });
                }
            }, async err => {
                await this.utilsService.showToast('Fallo Iniciar Sesión con Facebook');
                console.log('Error Login', err);
            });
    }
    async loginUserByGoogle() {
                await this.socialDataService.loginByGoogle();
                await this.socialDataService.googleLoginData.subscribe(async googleData => {
                    if (googleData) {
                        const user = this.socialDataService.getDataGoogleParsed(googleData);
                        await this.authService.login('google', user).subscribe(async loginData => {
                            await this.setLoginUserData(loginData);
                        });
                    }
                }, async err => {
                    await this.utilsService.showToast('Fallo Iniciar Sesión con Google');
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
