import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';
import { UtilsService } from 'src/app/services/utils.service';
import { IRespuestaApiSIUSingle } from "src/app/interfaces/models";
import { decodeToken } from 'src/app/helpers/auth-helper';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorService } from 'src/app/services/error.service';
import { MessagesService } from 'src/app/services/messages.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { LocalDataService } from '../../services/local-data.service';
// Valid
import {CedulaValidator} from 'src/app/helpers/cedula.validator';

@Component({
    selector: 'app-request-membership',
    templateUrl: './request-membership.page.html',
    styleUrls: ['./request-membership.page.scss'],
})
export class RequestMembershipPage implements OnInit {

    publicServiceImg = [];
    membershipForm: FormGroup;
    formSended = false;
    errorMessages = null;

    constructor(
        private modalCtrl: ModalController,
        private userService: UserService,
        private authService: AuthService,
        private localDataService: LocalDataService,
        private utilsService: UtilsService,
        private errorService: ErrorService,
        private messageService: MessagesService,
        public formBuilder: FormBuilder
    ) {
        this.createForm();
     }

    ngOnInit() {
        // this.membershipForm.
    }

    createForm(){
        //Cargar Validaciones
        const validations = this.localDataService.getFormValidations();
        // Campo Número de Cédula
        const cedula = new FormControl('', Validators.compose([
            Validators.required,
            Validators.minLength(10),
            Validators.maxLength(10),
            CedulaValidator
        ]));
        // Añado Propiedades al Form
        this.membershipForm = this.formBuilder.group({ cedula});
        // Cargo Mensajes de Validaciones
        this.errorMessages = this.localDataService.getFormMessagesValidations(validations);
    }

    closeModal():void {
        this.modalCtrl.dismiss();
    }

    getUploadedImages(event: any) {
        // console.log(event);
        this.publicServiceImg = event.total_img;
    }

    deleteImage(pos: number) {
        this.publicServiceImg.splice(pos, 1);
    }

    sendRequestMembership() {

        //console.log('form all', this.membershipForm);
        const formValue = this.membershipForm.value;
        const imagen = this.publicServiceImg[0];
        const requestObj = {
            cedula: formValue.cedula,
            basic_service_image: imagen
        }
        
        //console.log('formValue', formValue);
        // console.log('requestObj', requestObj);
        // return;
        this.userService.sendRequestUserMembership(requestObj).subscribe(async (res: IRespuestaApiSIUSingle) => {
            const token = res.data.token;
            const token_decoded = decodeToken(token);
            this.authService.saveUserInfo(token, token_decoded);
            this.authService.saveLocalStorageInfo(token, token_decoded);
            this.messageService.showSuccess("Solicitud Enviada Correctamente");
            this.formSended = true;
        },(err: HttpErrorResponse) => {
            this.errorService.manageHttpError(err, 'La solicitud no ha podido ser enviada');
        });
    }

}
