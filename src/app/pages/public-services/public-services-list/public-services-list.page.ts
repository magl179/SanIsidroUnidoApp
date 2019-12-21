import { Component, OnInit } from '@angular/core';
import { UtilsService } from 'src/app/services/utils.service';
import { IPublicService } from 'src/app/interfaces/models';
import { ModalController, NavController } from "@ionic/angular";
import { MapInfoPage } from "src/app/modals/map-info/map-info.page";
import { finalize, take, map } from 'rxjs/operators';
import { IRespuestaApiSIU } from "src/app/interfaces/models";
import { getRandomColor } from 'src/app/helpers/utils';
import { PublicService } from 'src/app/services/public.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'siu-public-services-list',
    templateUrl: './public-services-list.page.html',
    styleUrls: ['./public-services-list.page.scss'],
})
export class PublicServicesListPage implements OnInit {

    publicServicesPoints: any[] = [];
    publicServices: IPublicService[] = [];
    filterPublicServices = [];
    publicServiceSelected = null;
    currentLocation = null;
    markerSelected = false;
    publicServicesLoaded = false;
    category: string;

    constructor(
        private activatedRoute: ActivatedRoute,
        private utilsService: UtilsService,
        private publicService: PublicService,
        private navCtrl: NavController,
        private router: Router,
        private modalCtrl: ModalController
    ) { 
     
    }

    async ngOnInit() {
        this.category = this.activatedRoute.snapshot.paramMap.get('category'); 
        this.loadPublicServices();
    }

    loadPublicServices() {
        this.publicServicesLoaded = false;
        this.publicService.getPublicServicesByCategory(this.category).pipe(
            map((res: IRespuestaApiSIU )=> {
                res.data.forEach(public_service => {
                    public_service.color = getRandomColor()
                });
                return res;
            }),
            take(1),
            finalize(() => {
            this.publicServicesLoaded = true;
        })).subscribe((response: IRespuestaApiSIU) => {
            this.publicServices = response.data;
        }, (err: any) => {
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
            // console.log('Retorno de Datos del Modal: ', data);
        }

    }

    async showPublicService(indice) {
        await this.utilsService.showToast({message: `Mostrar Servicio Público con el ID: ${indice}`});
    }

    goToDetail(id: number) {
        const url = `/public-services/list/${this.category}/${id}`;
        this.navCtrl.navigateForward(url);
    }
}
