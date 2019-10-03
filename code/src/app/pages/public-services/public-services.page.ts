import { Component, OnInit } from '@angular/core';
import { UtilsService } from 'src/app/services/utils.service';
import { IPublicService } from 'src/app/interfaces/models';
import { PostsService } from 'src/app/services/posts.service';
import { NetworkService } from 'src/app/services/network.service';
import { ModalController } from "@ionic/angular";
import { MapInfoPage } from "src/app/modals/map-info/map-info.page";
import { finalize } from 'rxjs/operators';
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
    publicServicesObservable$: Subscription;
    publicServicesPoints: any[] = [];
    publicServices: IPublicService[] = [];
    filterPublicServices = [];
    // isPublicServiceAvalaible = false;
    publicServiceSelected = null;
    currentLocation = null;
    // publicServiceClicked = false;
    // loading: any;
    markerSelected = false;
    publicServicesLoaded = false;

    constructor(
        private utilsService: UtilsService,
        private networkService: NetworkService,
        // private cacheService: CacheService,
        private postService: PostsService,
        private modalCtrl: ModalController
    ) { }

    async ngOnInit() {
        this.loadPublicServices();
    }

    loadPublicServices() {
        
        this.publicServicesLoaded = false;
        this.publicServicesObservable$ = this.postService.getPublicServices().pipe(finalize(() => {
            this.publicServicesLoaded = true;
        })).subscribe((response: IRespuestaApiSIU) => {
            this.publicServices = response.data;
        }, err => {
                this.utilsService.showToast('No se pudieron cargar los servicios públicos');
                console.log('Servicios Publicos', err);
        });
    }

    searchPublicServices(event) {
        // Initialize Public Services Data
        this.filterPublicServices = this.publicServicesPoints;
        const val = event.target.value;
        // if the value is an empty string don't filter the items
        if (val && val.trim() !== '') {
            this.filterPublicServices = this.publicServicesPoints.filter((item) => {
                return (item.title.toLowerCase().indexOf(val.toLowerCase()) > -1);
            });
        }
    }

    async lanzarModal() {
        if(this.publicServiceSelected && this.markerSelected){
            // publicServices
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
        await this.utilsService.showToast(`Mostrar Servicio Público con el ID: ${indice}`);
    }

    manageDataMap(event) {
        console.log({ datosHijoPS: event });
        if (event.serviceSelected) {
            this.publicServiceSelected = event.serviceSelected;
            this.currentLocation = event.currentLocation;
            // this.mapPointSelected = 
            this.markerSelected = event.markerSelected;
            this.lanzarModal();
        }
    }

    ionViewWillLeave() {
        this.publicServicesObservable$.unsubscribe();
    }
}
