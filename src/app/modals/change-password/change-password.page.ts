import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { UtilsService } from 'src/app/services/utils.service';
import { MustMatch } from 'src/app/helpers/must-match.validator';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { LocalDataService } from "src/app/services/local-data.service";
import { IRespuestaApiSIUSingle } from "src/app/interfaces/models";
import { decodeToken } from 'src/app/helpers/auth-helper';
import { setInputFocus } from 'src/app/helpers/utils';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'app-change-password',
    templateUrl: './change-password.page.html',
    styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage implements OnInit {

    @ViewChild('passwordEyeChangePass', {read: ElementRef}) passwordEye: ElementRef;
    @ViewChild('passwordConfirmEyeChangePass', {read: ElementRef}) passwordEyeConfirmEye: ElementRef;
    passwordTypeInput = 'password';
    passwordConfirmTypeInput = 'password';
    changePassForm: FormGroup;
    errorMessages = null;
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
        this.authService.sessionAuthUser.subscribe(res => {
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
        setInputFocus(this.passwordEye);
    }

    togglePasswordConfirmMode() {
        this.passwordConfirmTypeInput = this.passwordConfirmTypeInput === 'text' ? 'password' : 'text';
        setInputFocus(this.passwordEyeConfirmEye);
    }

    closeModal() {
        this.modalCtrl.dismiss();
    }

    sendRequestChangePass() {
        this.userService.sendChangeUserPassRequest(this.changePassForm.value.password).subscribe(async (res: IRespuestaApiSIUSingle) => {
            const token = res.data.token;
            const token_decoded = decodeToken(token);
            this.authService.saveUserInfo(token, token_decoded);
            this.authService.saveLocalStorageInfo(token, token_decoded);
            this.changePassForm.reset();
            this.utilsService.showToast({message: 'Contraseña Actualizada Correctamente'});

        },(err: HttpErrorResponse) => {
            if (err.error instanceof Error) {
                console.log("Client-side error", err);
            } else {
                console.log("Server-side error", err);
            }
            this.utilsService.showToast({message: 'La Contraseña no se ha podido actualizar'});
        });
    }

}