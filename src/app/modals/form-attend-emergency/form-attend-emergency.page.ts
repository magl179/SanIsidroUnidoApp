import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { IEmergency, IUser } from 'src/app/interfaces/models';
import { PostsService } from 'src/app/services/posts.service';
import { MessagesService } from 'src/app/services/messages.service';
import { ErrorService } from 'src/app/services/error.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'modal-edit-profile',
    templateUrl: './form-attend-emergency.page.html',
    styleUrls: ['./form-attend-emergency.page.scss'],
})
export class FormAttendEmergencyModal implements OnInit {

    attendEmergencyForm: FormGroup;
    userName = '';
    AuthUser: IUser;
    Emergency: IEmergency;
    formWasSended = false;

    constructor(
        private modalCtrl: ModalController,
        public formBuilder: FormBuilder,
        private postsService: PostsService,
        private messagesService: MessagesService,
        private errorService: ErrorService
    ){
        const reason = new FormControl('', Validators.compose([
            Validators.required,
            Validators.maxLength(300)
        ]));
        this.attendEmergencyForm = this.formBuilder.group({reason});
    }

    ngOnInit(){
        this.userName = this.AuthUser.first_name;
    }

    preventEnterPressed($event: KeyboardEvent): void {
        $event.preventDefault()
        $event.stopPropagation()
    }
    
    onClose(){
        this.modalCtrl.dismiss({
            formulario_enviado: this.formWasSended,
            cancel: true
        });
    }

    closeModal() {
        this.modalCtrl.dismiss({
            formulario_enviado: this.formWasSended,
            cancel: false
        });
    }

    onSubmit(){
        const motivo = this.attendEmergencyForm.value.reason;
        const emergencia_id = this.Emergency.id;

        const body = {motivo, emergencia_id
        };
        this.postsService.sendPoliciaRechazarEmergencia(body).subscribe((res:any)=> {
            this.messagesService.showInfo("Haz rechazado correctamente este reporte");
            this.formWasSended = true;
            this.closeModal();
        },(error_http: HttpErrorResponse) => {
            this.errorService.manageHttpError(error_http, 'Ocurrio un error al registrar el motivo de rechazo');
        })
    }
}