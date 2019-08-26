import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { UtilsService } from 'src/app/services/utils.service';
import { MustMatch } from 'src/app/helpers/must-match.validator';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
    selector: 'app-change-password',
    templateUrl: './change-password.page.html',
    styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage implements OnInit {

    @ViewChild('passwordEyeChangePass') passwordEye;
    @ViewChild('passwordConfirmEyeChangePass') passwordConfirmEye;
    passwordTypeInput = 'password';
    iconpassword = 'eye-off';
    passwordConfirmTypeInput = 'password';
    iconConfirmpassword = 'eye-off';

    // currentUser = null;
    changePassForm: FormGroup;
    errorMessages = null;
    changePassFormFields = {
        password: {
            required: true,
            minlength: 3
        },
        confirmPassword: {
            required: true,
            minlength: 8
        }
    };
    //Usuario Autenticado
    AuthUser = null;
    constructor(
        private modalCtrl: ModalController,
        public formBuilder: FormBuilder,
        private authService: AuthService,
        private userService: UserService,
        private utilsService: UtilsService
    ) {
        this.createForm();
        this.loadErrorMessages();
    }

    ngOnInit() {
    }

    async loadAuthData() {
        await this.authService.getAuthUser().subscribe(res => {
            if (res) {
                this.AuthUser = res.user;
            }
        });
    }

    // Función Crea el Formulario
    async createForm() {
        await this.loadAuthData();
        // Campo Email
        const password = new FormControl('', Validators.compose([
            Validators.required
        ]));
        const confirmPassword = new FormControl('', Validators.compose([
            Validators.required
        ]));
        // Añado Propiedades al Form
        this.changePassForm = this.formBuilder.group({
            password,
            confirmPassword
        }, {
                validator: MustMatch('password', 'confirmPassword')
            });
    }

    loadErrorMessages() {
        this.errorMessages = {
            password: {
                required: {
                    message: 'La Contraseña es Obligatoria'
                }
            },
            confirmPassword: {
                required: {
                    message: 'La Contraseña de Confirmación es Obligatoria'
                },
                mustMatch: {
                    message: `Las contraseñas no coinciden`
                }
            }
        };

    }

    togglePasswordMode() {
        this.passwordTypeInput = this.passwordTypeInput === 'text' ? 'password' : 'text';
        this.iconpassword = this.iconpassword === 'eye-off' ? 'eye' : 'eye-off';
        // console.log(this.passwordEye);
        this.passwordEye.el.setFocus();
    }

    toggleConfirmPasswordMode() {
        this.passwordConfirmTypeInput = this.passwordConfirmTypeInput === 'text' ? 'password' : 'text';
        this.iconConfirmpassword = this.iconConfirmpassword === 'eye-off' ? 'eye' : 'eye-off';
        // console.log(this.passwordEye);
        this.passwordConfirmEye.el.setFocus();
    }

    closeModal() {
        this.modalCtrl.dismiss();
    }

    sendRequestChangePass() {
        // this.utilsService.showToast(JSON.stringify(this.changePassForm.value));
        this.userService.sendChangeUserPassRequest(this.changePassForm.value.password).subscribe(async (res: any) => {
            await this.utilsService.showToast('Contraseña Actualizada Correctamente');
            this.authService.updateAuthInfo(res.data.token, res.data.user);
            this.changePassForm.reset();

        }, err => {
            this.utilsService.showToast('Contraseña No se pudo actualizar :( ');
            console.log('error al actualizar contraseña usuario', err);
        });
    }

}
