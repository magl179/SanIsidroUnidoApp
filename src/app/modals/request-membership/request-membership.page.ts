import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';
import { IRespuestaApiSIUSingle } from "src/app/interfaces/models";
import { decodeToken } from 'src/app/helpers/auth-helper';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorService } from 'src/app/services/error.service';
import { MessagesService } from 'src/app/services/messages.service';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { LocalDataService } from 'src/app/services/local-data.service';

@Component({
    selector: 'app-request-membership',
    templateUrl: './request-membership.page.html',
    styleUrls: ['./request-membership.page.scss'],
})
export class RequestMembershipPage implements OnInit {

    publicServiceImg = [];
    formSended = false;
    errorMessages = null;
    requestMembershipForm: FormGroup;

    constructor(
        private modalCtrl: ModalController,
        private userService: UserService,
        private authService: AuthService,
        private errorService: ErrorService,
        private messageService: MessagesService,
        private localDataService: LocalDataService,
        public formBuilder: FormBuilder
    ) {
     }

    ngOnInit() {
        this.createForm();
    }

    createForm() {
         //Cargar Validaciones
         const validations = this.localDataService.getFormValidations();
        
         const nombres = new FormControl('', Validators.compose([
             Validators.required,
             Validators.maxLength(250)
         ]));
         
         const cedula = new FormControl('', Validators.compose([
             Validators.required,
             validations.cedula.pattern
         ]));

         const telefono = new FormControl('', Validators.compose([
            Validators.required,
            Validators.minLength(7),
            Validators.maxLength(10)
        ]));
         // Añado Propiedades al Form
         this.requestMembershipForm = this.formBuilder.group({ nombres, cedula, telefono });
         // Cargo Mensajes de Validaciones
         this.errorMessages = this.localDataService.getFormMessagesValidations(validations);
    }

    closeModal():void {
        this.modalCtrl.dismiss();
    }

    getUploadedImages(event: any) {
        this.publicServiceImg = event.total_img;
    }

    deleteImage(pos: number) {
        this.publicServiceImg.splice(pos, 1);
    }

    sendRequestMembership() {
        const imagen = this.publicServiceImg[0];
        const requestObj = {
            basic_service_image: imagen,
            ...this.requestMembershipForm.value
        }
        console.warn('membersgip body', requestObj)
        return;
        this.userService.sendRequestUserMembership(requestObj).subscribe(async (res: IRespuestaApiSIUSingle) => {
            const token = res.data.token;
            const token_decoded = decodeToken(token);
            this.authService.saveUserInfo(token, token_decoded);
            this.authService.saveLocalStorageInfo(token, token_decoded);
            this.messageService.showSuccess("Solicitud Enviada Correctamente");
            this.formSended = true;
            setTimeout(()=>{
                this.closeModal();
            }, 500);
        },(err: HttpErrorResponse) => {
            this.errorService.manageHttpError(err, 'La solicitud no ha podido ser enviada');
        });
    }

}
