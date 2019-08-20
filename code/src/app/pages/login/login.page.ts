import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { UtilsService } from 'src/app/services/utils.service';
import { timer } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { SocialDataService } from 'src/app/services/social-data.service';
import { LocalDataService } from '../../services/local-data.service';
import { finalize } from 'rxjs/operators';



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

    //loadingLogin: any;
    loginForm: FormGroup;
    errorMessages = null;

    constructor(
        public formBuilder: FormBuilder,
        private navCtrl: NavController,
        private utilsService: UtilsService,
        private authService: AuthService,
        private socialDataService: SocialDataService,
        private localDataService: LocalDataService
    ) {
        this.createForm();
        //this.loadErrorMessages();
    }

    async ngOnInit() {
        await this.utilsService.disabledMenu();
    }

    togglePasswordMode() {
        this.passwordTypeInput = this.passwordTypeInput === 'text' ? 'password' : 'text';
        this.iconpassword = this.iconpassword === 'eye-off' ? 'eye' : 'eye-off';
        // console.log(this.passwordEye);
        this.passwordEye.el.setFocus();
    }

    manageLogin(loginData, res) {
        // console.log('login token cifrado', res);
        this.loginData.token = res.data;
        //Obtener Usuario Identificado
        this.authService.login(loginData, true).subscribe(async res => {
            console.log('login token descifrado', res);
            if (res.code === 200) {
                this.loginData.user = res.data;
                await this.authService.setUserLocalStorage(this.loginData.user);
                await this.authService.setTokenLocalStorage(this.loginData.token);
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
        const loginData = { email, password, provider: 'formulario' };
        await this.authService.login(loginData).pipe(
            finalize(() => {
                loadingLoginValidation.dismiss()
            })
        ).subscribe(res => {
                // console.log('Login First Response', res);
                //if (res.code === 200) {
                    this.manageLogin(loginData, res);
                //} //
            }, err => {
                this.utilsService.showToast(err.error.message);
                console.log('Error Login', err.error);
            });
    }

    async loginUserByFB() {
            await this.socialDataService.loginByFacebook();
            await this.socialDataService.fbLoginData.subscribe(async fbData => {
                if (fbData) {
                    const user = this.socialDataService.getFacebookDataParsed(fbData);
                    // const social_id = user.social_id, email = user.email;
                    const { social_id, email } = user;
                    await this.authService.login(user).subscribe(res => {
                        // console.log('Login First Response', res);
                        //if (res.code === 200) {
                            this.manageLogin({provider: 'facebook', social_id, email} , res);
                        //} else {
                          //  this.utilsService.showToast('Fallo Iniciar Sesión 1');
                        //}
                    }, err => {
                        this.utilsService.showToast(err.error.message);
                        console.log('Error Login', err.error);
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
                        const user = this.socialDataService.getGoogleDataParsed(googleData);
                        const { social_id, email } = user;
                        await this.authService.login(user).subscribe(async res => {
                            console.log('Login First Response', res);
                            //if (res.code === 200) {
                                await this.manageLogin({social_id, email, provider: 'google'} , res);
                            //} 
                            //else {
                                //this.utilsService.showToast('Fallo Iniciar Sesión 1');
                            //}
                        }, err => {
                            this.utilsService.showToast(err.error.message);
                            console.log('Error Login', err.error);
                        });
                    }
                }, async err => {
                    await this.utilsService.showToast('Fallo Iniciar Sesión con Google');
                    console.log('Error Login', err);
                });
        }

    // Función Crea el Formulario
    createForm() {
        //Cargar Validaciones
        const validations = this.localDataService.getFormValidations();
        // Campo Email
        const email = new FormControl('', Validators.compose([
            Validators.required,    
            Validators.email
        ]));
        // Campo Contraseña
        const password= new FormControl('', Validators.compose([
            Validators.required
        ]));
        // Añado Propiedades al Form
        this.loginForm = this.formBuilder.group({ email, password });
         // Cargo Mensajes de Validaciones
        this.errorMessages = this.localDataService.getFormMessagesValidations(validations);
    }

    /*loadErrorMessages() {
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
    }*/

}
