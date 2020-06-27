import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';
import { IRespuestaApiSIUSingle, IUploadedImages, ITokenDecoded } from "src/app/interfaces/models";
import { decodeToken } from 'src/app/helpers/auth-helper';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorService } from 'src/app/services/error.service';
import { MessagesService } from 'src/app/services/messages.service';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { LocalDataService } from 'src/app/services/local-data.service';
import { UploadImageComponent } from 'src/app/components/upload-image/upload-image.component';
import { mapUser } from 'src/app/helpers/utils';
import { map } from 'rxjs/operators';

@Component({
    selector: 'app-request-membership',
    templateUrl: './request-membership.page.html',
    styleUrls: ['./request-membership.page.scss'],
})
export class RequestMembershipPage implements OnInit {

    @ViewChild(UploadImageComponent) uploadImageComponent: UploadImageComponent;
    publicServiceImg = [];
    formSended = false;
    errorMessages = null;
    requestMembershipForm: FormGroup;
    sessionAuth: ITokenDecoded;

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
        this.authService.sessionAuthUser.pipe(
            map((token_decoded) => {
                if (token_decoded && token_decoded.user) {
                    token_decoded.user = mapUser(token_decoded.user);
                }
                return token_decoded;
            })
        ).subscribe(token_decoded => {
            this.sessionAuth = token_decoded;
            this.createForm();
        });
        
    }

    createForm() {
        //Cargar Validaciones
        const user = (this.sessionAuth) ? this.sessionAuth.user: null;
        const validations = this.localDataService.getFormValidations();

        const nombres = new FormControl(
            {value: (user) ? user.fullname: '', disabled: true},
        Validators.compose([
            Validators.required,
            Validators.maxLength(250)
        ]));

        const cedula = new FormControl('', Validators.compose([
            Validators.required,
            validations.cedula.pattern
        ]));

        const telefono = new FormControl(
        {value: (user) ? user.number_phone: '', disabled: false}, 
        Validators.compose([
            Validators.required,
            Validators.minLength(7),
            Validators.maxLength(10)
        ]));
        // Añado Propiedades al Form
        this.requestMembershipForm = this.formBuilder.group({ nombres, cedula, telefono });
        // Cargo Mensajes de Validaciones
        this.errorMessages = this.localDataService.getFormMessagesValidations(validations);
    }

    preventEnterPressed($event: KeyboardEvent): void {
        $event.preventDefault()
        $event.stopPropagation()
    }

    closeModal(): void {
        this.modalCtrl.dismiss();
    }

    getUploadedImages(event: IUploadedImages) {
        this.publicServiceImg = event.uploaded_images;

    }

    deleteImage(index: number) {
        this.publicServiceImg.splice(index, 1);
        this.uploadImageComponent.deleteImage(index);
    }

    sendRequestMembership() {
        const imagen = this.publicServiceImg[0];
        const requestObj = {
            basic_service_image: imagen,
            ...this.requestMembershipForm.value
        }
        this.userService.sendRequestUserMembership(requestObj).subscribe(async (res: IRespuestaApiSIUSingle) => {
            const token = res.data.token;
            const token_decoded = decodeToken(token);
            this.authService.saveUserInfo(token, token_decoded);
            this.authService.saveLocalStorageInfo(token, token_decoded);
            this.messageService.showSuccess("Solicitud Enviada Correctamente");
            this.formSended = true;
            setTimeout(() => {
                this.closeModal();
            }, 500);
        }, (error_http: HttpErrorResponse) => {
            this.errorService.manageHttpError(error_http, 'La solicitud no ha podido ser enviada');
        });
    }

}
