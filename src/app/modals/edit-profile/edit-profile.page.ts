import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { UtilsService } from 'src/app/services/utils.service';
import { UserService } from 'src/app/services/user.service';
import { LocalDataService } from 'src/app/services/local-data.service';
import { decodeToken } from 'src/app/helpers/auth-helper';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorService } from 'src/app/services/error.service';
import { MessagesService } from 'src/app/services/messages.service';
import { TelefonoValidator } from 'src/app/helpers/numero_telefono.validator';

@Component({
    selector: 'modal-edit-profile',
    templateUrl: './edit-profile.page.html',
    styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {

    AuthUser = null;
    editProfileForm: FormGroup;
    errorMessages = null;
    formSended = false;

    constructor(
        private modalCtrl: ModalController,
        private authService: AuthService,
        public formBuilder: FormBuilder,
        private localDataService: LocalDataService,
        private userService: UserService,
        private errorService: ErrorService,
        private messageService: MessagesService,
        private utilsService: UtilsService) {
        
    }

    async ngOnInit() {
        this.loadUserData();
        this.createForm();
    }

    async loadUserData() {
        //OBTENER INFORMACIÓN USUARIO AUTENTICADO, FORMA CORRECTA
        const response_auth: any =  await this.authService.getTokenUserAuthenticated().catch(err=>console.log('err', err))
        if (response_auth) {
            this.AuthUser = response_auth.user;
            // console.log('auth user', response_auth.user)
        }
    }

    closeModal() {
        this.modalCtrl.dismiss();
    }

    editUserProfileData() {
        // console.log('this.editProfileForm.value', this.editProfileForm.getRawValue())
        // return;
        //Obtener valor incluido campos disabled
        this.userService.sendEditProfileRequest(this.editProfileForm.getRawValue()).subscribe(async res => {
            const token = res.data.token;
            const token_decoded = decodeToken(token);
            this.authService.saveUserInfo(token, token_decoded);
            this.authService.saveLocalStorageInfo(token, token_decoded);
            this.messageService.showSuccess('Tus datos fueron actualizados correctamente');
            this.formSended = true;
        },(err: HttpErrorResponse) => {
            this.errorService.manageHttpError(err, 'Tus datos no se pudieron actualizar');
        });
    }

    // Función Crea el Formulario
    async createForm() {
        await this.loadUserData();
        const validations = this.localDataService.getFormValidations();
        // Campo Email
        const first_name = new FormControl(this.AuthUser.first_name || '', Validators.compose([
            Validators.required
        ]));
        const last_name = new FormControl(this.AuthUser.last_name || '', Validators.compose([
            Validators.required
        ]));
        const email = new FormControl(
            {value: this.AuthUser.email || '', disabled: true}, Validators.compose([
            Validators.email
        ]));
        // Campo Contraseña
        const number_phone = new FormControl(this.AuthUser.number_phone || '',
            Validators.compose([
                Validators.minLength(validations.number_phone.minlength),
                Validators.maxLength(validations.number_phone.maxlength),
                TelefonoValidator
            ]));
        // Añado Propiedades al Form
        this.editProfileForm = this.formBuilder.group({first_name, last_name, email, number_phone});
        this.errorMessages = this.localDataService.getFormMessagesValidations(validations);
    }

}
