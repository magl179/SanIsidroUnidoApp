import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UtilsService } from "src/app/services/utils.service";
import { PostsService } from "src/app/services/posts.service";
import { NetworkService } from "src/app/services/network.service";
import { AuthService } from "src/app/services/auth.service";
import { finalize, map, take } from 'rxjs/operators';
import { IRespuestaApiSIUSingle } from 'src/app/interfaces/models';
import { ModalController } from "@ionic/angular";
import { ImageDetailPage } from 'src/app/modals/image_detail/image_detail.page';
import { mapEmergency } from 'src/app/helpers/utils';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorService } from 'src/app/services/error.service';

@Component({
    selector: 'app-emergency-detail',
    templateUrl: './emergency-detail.page.html',
    styleUrls: ['./emergency-detail.page.scss'],
})
export class EmergencyDetailPage implements OnInit {
    id: string;
    emergency = null;
    emergencyLoaded = false;
    AuthUser = null;
    isPoliciaRol = false;
    urlBackEmergency = '';

    constructor(private activatedRoute: ActivatedRoute,
        public utilsService: UtilsService,
        private postsService: PostsService,
        private modalCtrl: ModalController,
        private errorService: ErrorService,
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
        this.urlBackEmergency = (isPolicia) ? '/home-list' : '/emergencies/list';
        console.log('ROL IS POLICIA', isPolicia);
    }

    //POLICIA COMUNITARIO
    onPoliciaAcceptEmergency(){
        //cambiar estado evento a atendido
        //guardar usuario que va a atender
        //el back notificar al usuario que tal policia le va a atender
    }

    onPoliciaDenyEmergency(){
        //Ocultar botones, en este caso seria cambiar ispolicia rol
    }

}
