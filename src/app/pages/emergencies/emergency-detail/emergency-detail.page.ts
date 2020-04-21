import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UtilsService } from "src/app/services/utils.service";
import { PostsService } from "src/app/services/posts.service";
import { NetworkService } from "src/app/services/network.service";
import { AuthService } from "src/app/services/auth.service";
import { finalize, map, take } from 'rxjs/operators';
import { IRespuestaApiSIUSingle, IEmergency } from 'src/app/interfaces/models';
import { ModalController } from "@ionic/angular";
import { ImageDetailPage } from 'src/app/modals/image_detail/image_detail.page';
import { mapEmergency } from 'src/app/helpers/utils';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorService } from 'src/app/services/error.service';
import { MessagesService } from '../../../services/messages.service';
import { FormAttendEmergencyModal } from 'src/app/modals/form-attend-emergency/form-attend-emergency.page';


@Component({
    selector: 'app-emergency-detail',
    templateUrl: './emergency-detail.page.html',
    styleUrls: ['./emergency-detail.page.scss'],
})
export class EmergencyDetailPage implements OnInit {
    id: string;
    emergency: IEmergency = null;
    emergencyLoaded = false;
    AuthUser = null;
    isPoliciaRol = false;
    urlBackEmergency = '';
    showPoliciaOptions = false;

    constructor(private activatedRoute: ActivatedRoute,
        public utilsService: UtilsService,
        private postsService: PostsService,
        private modalCtrl: ModalController,
        private errorService: ErrorService,
        private messagesService: MessagesService,
        private authService: AuthService) { }

    ngOnInit() {

        this.id = this.activatedRoute.snapshot.paramMap.get('id');
        this.authService.sessionAuthUser.subscribe(token_decoded => {
            if (token_decoded && token_decoded.user) {
                this.AuthUser = token_decoded.user;
            }
        });
        this.getEmergency();
        this.checkPoliciaRol();
    }

    getEmergency(event?: any, resetEvents?: any) {
        this.emergencyLoaded = false;
        this.postsService.getEmergency(+this.id).pipe(
            take(1),
            map((res: any) => {
                if (res && res.data) {
                    const emergency = res.data;
                    res.data = mapEmergency(emergency);
                }
                return res;
            }),
            finalize(() => {
                this.emergencyLoaded = true;
            })
        ).subscribe((res: IRespuestaApiSIUSingle) => {
            this.emergency = res.data;
        },(err: HttpErrorResponse) => {
            this.errorService.manageHttpError(err, 'Ocurrio un error al traer el detalle de la emergencia');
        });
    }

    getBGCover(image_cover: string) {
        return `linear-gradient(to bottom, rgba(0, 0, 0, 0.32), rgba(0, 0, 0, 0.23)), url('${image_cover}')`;
    }

    async showImageDetailModal(image: string) {
        const modal = await this.modalCtrl.create({
            component: ImageDetailPage,
            componentProps: {
                image,
            }
        });
        await modal.present();
    }

    seeImageDetail(image: string) {
        this.utilsService.seeImageDetail(image, 'Imagen Evento');
    }

    async checkPoliciaRol(){
        const isPolicia = await this.authService.userHasRole(['Policia']);
        this.isPoliciaRol = isPolicia;
        this.showPoliciaOptions = isPolicia;
        this.urlBackEmergency = '/emergencies/list';
        // this.urlBackEmergency = (isPolicia) ? '/home-list' : '/emergencies/list';
    }

    //POLICIA COMUNITARIO
    onPoliciaAcceptEmergency(){
        //cambiar estado evento a atendido
        //guardar usuario que va a atender
        //el back notificar al usuario que tal policia le va a atender
        //informar si se guardo o no el dato
        this.postsService.sendPoliciaAtenderEmergencia({emergencia_id: this.emergency.id}).subscribe((res:any)=> {
            this.messagesService.showInfo("Has aceptado atender la emergencia");
            this.showPoliciaOptions = false;
            this.emergency.is_attended = 1;
        },(err: HttpErrorResponse) => {
            this.errorService.manageHttpError(err, 'Ocurrio un error al registrar la solicitud de atención de emergencia');
        })
    }

    async onPoliciaDenyEmergency(){
        //Ocultar botones, en este caso seria cambiar ispolicia rol
       
        const modal = await this.modalCtrl.create({
            component: FormAttendEmergencyModal,
            componentProps: {
                AuthUser: this.AuthUser,
                Emergency: this.emergency
            },
            backdropDismiss: false
        });
        await modal.present();
        const { data } : any = await modal.onWillDismiss();
        console.log({
            dataModal: data
        });
        if(data.formulario_enviado){
            // this.showPoliciaOptions = false;
            this.messagesService.showInfo("El Formulario se envio");
            this.getEmergency();
        }else{
            this.messagesService.showInfo("El Formulario no se envio");
        }
    }

}
