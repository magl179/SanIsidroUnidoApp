import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { UtilsService } from 'src/app/services/utils.service';
import { MustMatch } from 'src/app/helpers/must-match.validator';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { LocalDataService } from "../../services/local-data.service";
import { IRespuestaApiSIUSingle } from "../../interfaces/models";

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

    changePassForm: FormGroup;
    errorMessages = null;
    //Usuario Autenticado
    AuthUser = null;
    constructor(
        private modalCtrl: ModalController,
        public formBuilder: FormBuilder,
        private authService: AuthService,
        private userService: UserService,
        private utilsService: UtilsService,
        private localDataService: LocalDataService
    ) {
        this.createForm();
    }

    ngOnInit() {
    }

    async loadAuthData() {
        this.authService.getAuthUser().subscribe(res => {
            if (res) {
                this.AuthUser = res.user;
            }
        });
    }

    // Función Crea el Formulario
    async createForm() {
        await this.loadAuthData();
        // Validaciones Formulario
        const validations = this.localDataService.getFormValidations();
        // Campos Formulario
        const password = new FormControl('', Validators.compose([
            Validators.required
        ]));
        const password_confirm = new FormControl('', Validators.compose([
            Validators.required
        ]));
        // Añado Propiedades al Formulario
        this.changePassForm = this.formBuilder.group({password, password_confirm}, {
                validator: MustMatch('password', 'password_confirm')
        });
        // Cargo los errores del formulario
        this.errorMessages = this.localDataService.getFormMessagesValidations(validations);
    }

    togglePasswordMode() {
        this.passwordTypeInput = this.passwordTypeInput === 'text' ? 'password' : 'text';
        this.iconpassword = this.iconpassword === 'eye-off' ? 'eye' : 'eye-off';
        this.passwordEye.el.setFocus();
    }

    togglePasswordConfirmMode() {
        this.passwordConfirmTypeInput = this.passwordConfirmTypeInput === 'text' ? 'password' : 'text';
        this.iconConfirmpassword = this.iconConfirmpassword === 'eye-off' ? 'eye' : 'eye-off';
        this.passwordConfirmEye.el.setFocus();
    }

    closeModal() {
        this.modalCtrl.dismiss();
    }

    sendRequestChangePass() {
        this.userService.sendChangeUserPassRequest(this.changePassForm.value.password).subscribe(async (res: IRespuestaApiSIUSingle) => {
            const token = res.data.token;
            this.authService.updateFullAuthInfo(token);
            this.changePassForm.reset();
            this.utilsService.showToast('Contraseña Actualizada Correctamente');

        }, err => {
            this.utilsService.showToast('La Contraseña no se ha podido actualizar');
            console.log('error al actualizar contraseña usuario', err);
        });
    }

}
