import { Component, OnInit } from '@angular/core';
import { UtilsService } from 'src/app/services/utils.service';
import { IPublicService } from 'src/app/interfaces/models';
import { ModalController, NavController } from "@ionic/angular";
import { MapInfoPage } from "src/app/modals/map-info/map-info.page";
import { finalize, take, map, tap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { IRespuestaApiSIU } from "src/app/interfaces/models";
import { getRandomColor } from 'src/app/helpers/utils';
import { PublicService } from 'src/app/services/public.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ErrorService } from 'src/app/services/error.service';
import { FormControl } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

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
    publicServicesFilter: any[] = [];
    publicServiceSearchControl: FormControl;
    searchingPublicServices = false;

    constructor(
        private activatedRoute: ActivatedRoute,
        private utilsService: UtilsService,
        private publicService: PublicService,
        private navCtrl: NavController,
        private errorService: ErrorService,
        private modalCtrl: ModalController
    ) { 
        this.publicServiceSearchControl = new FormControl();
    }

    async ngOnInit() {
        this.category = this.activatedRoute.snapshot.paramMap.get('category'); 
        this.loadPublicServices();
        this.publicServiceSearchControl.valueChanges
        .pipe(
            tap(() => {
                this.searchingPublicServices = true;
            }),
            distinctUntilChanged(),
        )
        .subscribe(search => {
            if(search == ''){
                this.publicServicesFilter = [... this.publicServices]
            }else{
                this.publicServicesFilter = [...this.publicServices].filter(public_service => public_service.name.toLowerCase().indexOf(search) > -1)
            }
            this.searchingPublicServices = false;
        });
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
            this.publicServices = [...response.data];
            this.publicServicesFilter = [...response.data];
        }, (err: HttpErrorResponse) => {
            this.errorService.manageHttpError(err, 'Ocurrio un error al cargar el listado de serviciós públicos')
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
        }

    }


    goToDetail(id: number) {
        const url = `/public-services/list/${this.category}/${id}`;
        this.navCtrl.navigateForward(url);
    }
}
