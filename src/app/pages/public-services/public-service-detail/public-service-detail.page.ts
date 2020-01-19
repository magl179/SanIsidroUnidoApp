import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IRespuestaApiSIUSingle } from 'src/app/interfaces/models';
import { PublicService } from "src/app/services/public.service";
import { take, finalize, flatMap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { LocalizationService } from "src/app/services/localization.service";
import { getDistanceInKm, roundDecimal } from 'src/app/helpers/utils';
import { UtilsService } from '../../../services/utils.service';
import { ErrorService } from '../../../services/error.service';

@Component({
    selector: 'siu-public-service-detail',
    templateUrl: './public-service-detail.page.html',
    styleUrls: ['./public-service-detail.page.scss'],
})
export class PublicServiceDetailPage implements OnInit {

    id: string;
    backUrl: string;
    category: string;
    publicServiceLoaded = false;
    publicServiceDetail = null;
    mapLoaded = false;

    currentPosition = null;

    constructor(
        private activatedRoute: ActivatedRoute,
        private localizationService: LocalizationService,
        private publicService: PublicService,
        private utilsService: UtilsService,
        private errorService: ErrorService
    ) {
    }

    async ngOnInit() {
        this.id = this.activatedRoute.snapshot.paramMap.get('id');
        this.category = this.activatedRoute.snapshot.paramMap.get('category');
        this.getPublicServiceDetail();
        this.backUrl = `/public-services/list/${this.category}`;

        await this.localizationService.getCoordinates().then(coordinates=>{
            this.currentPosition = coordinates;
        }).catch(err=>{
            console.log('Error al obtener geolocalizacion', err);
        });

        console.log('current position', this.currentPosition);
    }

    getPublicServiceDetail() {
        this.publicServiceLoaded = false;
        this.publicService.getPublicService(+this.id).pipe(
            take(1),
            flatMap(async (res: IRespuestaApiSIUSingle) => {
                if (res && res.data) {
                    // const currentPosition: any = await this.localizationService.getCoordinates();
                    if (res.data.ubication.latitude && res.data.ubication.longitude && this.currentPosition ) {
                        res.data.distance = roundDecimal(getDistanceInKm(this.currentPosition.latitude, this.currentPosition.longitude, res.data.ubication.latitude, res.data.ubication.longitude));
                    }
                }
                return res;
            }),
            finalize(() => {
                this.publicServiceLoaded = true;
            })
        ).subscribe((res: IRespuestaApiSIUSingle) => {
            this.publicServiceDetail = res.data;
        }, (err: HttpErrorResponse) => {
                
            this.errorService.manageHttpError(err, 'Ocurrio un error al cargar el detalle del servicio')
        });
    }

    manageMapEvent(event: any) {
        if (event && event.loaded) {
            this.mapLoaded = true;
        }
    }

}
