import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { UtilsService } from '../../services/utils.service';
import { UserService } from '../../services/user.service';
import { LocalDataService } from 'src/app/services/local-data.service';

@Component({
    selector: 'modal-edit-profile',
    templateUrl: './edit-profile.page.html',
    styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {

    AuthUser = null;
    editProfileForm: FormGroup;
    errorMessages = null;

    constructor(
        private modalCtrl: ModalController,
        private authService: AuthService,
        public formBuilder: FormBuilder,
        private localDataService: LocalDataService,
        private userService: UserService,
        private utilsService: UtilsService) {
        this.createForm();
    }

    async ngOnInit() {

    }

    async loadUserData() {
        await this.authService.getAuthUser().subscribe(res => {
            if (res) {
                this.AuthUser = res.user;
            }
        });
    }

    closeModal() {
        this.modalCtrl.dismiss();
    }

    editUserProfileData() {
        this.userService.sendEditProfileRequest(this.editProfileForm.value).subscribe(async res => {
            this.utilsService.showToast('Datos Actualizados Correctamente');
            const token_decode = await this.authService.decodeToken(res.data.token);
            this.authService.updateAuthInfo(res.data.token, token_decode);
        }, err => {
            this.utilsService.showToast('Los datos no se pudieron actualizar');
            console.log('error al actualizar datos usuario', err);
        });
    }

    // Función Crea el Formulario
    async createForm() {
        await this.loadUserData();
        const validations = this.localDataService.getFormValidations();
        // Campo Email
        const firstname = new FormControl(this.AuthUser.firstname || '', Validators.compose([
            Validators.required
        ]));
        const lastname = new FormControl(this.AuthUser.lastname || '', Validators.compose([
            Validators.required
        ]));
        const email = new FormControl(this.AuthUser.email || '', Validators.compose([
            Validators.required,
            Validators.email
        ]));
        // Campo Contraseña
        const number_phone = new FormControl(this.AuthUser.number_phone || '',
            Validators.compose([
                Validators.minLength(validations.phone.minlength),
                Validators.maxLength(validations.phone.maxlength)
            ]));
        // Añado Propiedades al Form
        this.editProfileForm = this.formBuilder.group({firstname, lastname, email, number_phone});
        this.errorMessages = this.localDataService.getFormMessagesValidations(validations);
    }

}
