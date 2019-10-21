import { Component, OnInit } from '@angular/core';
import { UtilsService } from 'src/app/services/utils.service';
import { IPublicService } from 'src/app/interfaces/models';
import { PostsService } from 'src/app/services/posts.service';
import { NetworkService } from 'src/app/services/network.service';
import { ModalController } from "@ionic/angular";
import { MapInfoPage } from "src/app/modals/map-info/map-info.page";
import { finalize, take } from 'rxjs/operators';
// import { CacheService } from 'ionic-cache';
import { IRespuestaApiSIU } from "src/app/interfaces/models";
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-public-services',
    templateUrl: './public-services.page.html',
    styleUrls: ['./public-services.page.scss'],
})
export class PublicServicesPage implements OnInit {

    publicServicesKey = 'public_services-siu';
    publicServicesPoints: any[] = [];
    publicServices: IPublicService[] = [];
    filterPublicServices = [];
    publicServiceSelected = null;
    currentLocation = null;
    markerSelected = false;
    publicServicesLoaded = false;

    constructor(
        private utilsService: UtilsService,
        private postService: PostsService,
        private modalCtrl: ModalController
    ) { }

    async ngOnInit() {
        this.loadPublicServices();
    }

    loadPublicServices() {
        
        this.publicServicesLoaded = false;
        this.postService.getPublicServices().pipe(
            take(1),
            finalize(() => {
            this.publicServicesLoaded = true;
        })).subscribe((response: IRespuestaApiSIU) => {
            this.publicServices = response.data;
        }, (err: any) => {
                this.utilsService.showToast({message: 'No se pudieron cargar los servicios públicos'});
                console.log('Servicios Publicos', err);
        });
    }

    async lanzarModal() {
        if(this.publicServiceSelected && this.markerSelected){
            const modal = await this.modalCtrl.create({
                component: MapInfoPage,
                componentProps: {
                    mapPoint: this.publicServiceSelected,
                    pais: 'Ecuador',
                    currentLocation: this.currentLocation
                }
            });
            await modal.present();    
            const { data } = await modal.onDidDismiss();    
            if (data == null) {
                console.log('No hay datos que Retorne el Modal');
            } else {
                console.log('Retorno de Datos del Modal: ', data);
            }
        }

    }

    async showPublicService(indice) {
        console.log('Mostrar Servicio Público con el ID: ', indice);
        await this.utilsService.showToast({message: `Mostrar Servicio Público con el ID: ${indice}`});
    }

    manageDataMap(event: any) {
        console.log({ datosHijoPS: event });
        if (event.serviceSelected) {
            this.publicServiceSelected = event.serviceSelected;
            this.currentLocation = event.currentLocation;
            this.markerSelected = event.markerSelected;
            this.lanzarModal();
        }
    }
}
