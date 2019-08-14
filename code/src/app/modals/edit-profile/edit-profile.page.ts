import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { UtilsService } from '../../services/utils.service';
import { UserService } from '../../services/user.service';

@Component({
    selector: 'app-edit-profile',
    templateUrl: './edit-profile.page.html',
    styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {

    currentUser = null;
    editProfileForm: FormGroup;
    errorMessages = null;
    editProfileFormFields = {
        firstname: {
            required: true,
            minlength: 3,
            maxlength: 15
        },
        lastname: {
            required: true,
            minlength: 8,
            maxlength: 30
        },
        email: {
            required: true,
            minlength: 8,
            maxlength: 30
        },
        phone: {
            required: true,
            minlength: 8,
            maxlength: 30
        }
    };

    constructor(
        private modalCtrl: ModalController,
        private authService: AuthService,
        public formBuilder: FormBuilder,
        private userService: UserService,
        private utilsService: UtilsService) {
        this.createForm();
        this.loadErrorMessages();
    }

    async ngOnInit() {

    }

    async loadUserData() {
        await this.authService.getUserSubject().subscribe(res => {
            if (res) {
                this.currentUser = res.user;
            }
        });
    }

    closeModal() {
        this.modalCtrl.dismiss();
    }

    editUserProfileData() {
        // this.utilsService.showToast(JSON.stringify(this.editProfileForm.value));
        this.userService.sendEditProfileRequest(this.editProfileForm.value).subscribe(res => {
            alert('Datos Actualizados correctamente');
        }, err => {
                console.log('error al actualizar datos usuario', err);
        });
    }

    // Función Crea el Formulario
    async createForm() {
        await this.loadUserData();
        // Campo Email
        const firstname = new FormControl(this.currentUser.firstname || '', Validators.compose([
            Validators.required
        ]));
        const lastname = new FormControl(this.currentUser.lastname || '', Validators.compose([
            Validators.required
        ]));
        const email = new FormControl(this.currentUser.email || '', Validators.compose([
            Validators.required,
            Validators.email
        ]));
        // Campo Contraseña
        const number_phone = new FormControl(this.currentUser.number_phone || '',
            Validators.compose([]));
        // Añado Propiedades al Form
        this.editProfileForm = this.formBuilder.group({
            firstname,
            lastname,
            email,
            number_phone,
        });
    }

    loadErrorMessages() {
        this.errorMessages = {
            firstname: {
                required: {
                    message: 'Los Nombres son Obligatorios'
                }
            },
            lastname: {
                required: {
                    message: 'Los Apellidos es Obligatorio'
                }
            },
            email: {
                required: {
                    message: 'El Email es Obligatorio'
                },
                email: {
                    message: `Ingresa un email válido`
                }
            },
            number_phone: {}
        };

    }

}
