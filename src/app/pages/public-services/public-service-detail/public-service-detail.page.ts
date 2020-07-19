import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IRespuestaApiSIUSingle, ISimpleCoordinates, AppMapEvent, IPublicService } from 'src/app/interfaces/models';
import { PublicService } from "src/app/services/public.service";
import { take, finalize, flatMap, pluck, catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { LocalizationService } from "src/app/services/localization.service";
import { getDistanceInKm, roundDecimal } from 'src/app/helpers/utils';
import { ErrorService } from 'src/app/services/error.service';
import { of } from 'rxjs';

@Component({
    selector: 'siu-public-service-detail',
    templateUrl: './public-service-detail.page.html',
    styleUrls: ['./public-service-detail.page.scss'],
})
export class PublicServiceDetailPage implements OnInit {

    id: string;
    backUrl: string;
    showSimpleMap = true;
    category: string;
    publicServiceLoaded = false;
    publicServiceDetail: IPublicService = null;
    mapLoaded = false;
    currentPosition = null;

    constructor(
        private activatedRoute: ActivatedRoute,
        private localizationService: LocalizationService,
        private publicService: PublicService,
        private errorService: ErrorService
    ) {
    }

    ngOnInit(): void {
        this.id = this.activatedRoute.snapshot.paramMap.get('id');
        this.category = this.activatedRoute.snapshot.paramMap.get('category');
       
        this.getPublicServiceDetail();
        this.backUrl = `/public-services/list/${this.category}`;
        if(!this.showSimpleMap){
            this.localizationService.getCoordinates().then((coordinates: ISimpleCoordinates)=>{
                this.currentPosition = coordinates;               
            }).catch(()=>{
                return null;
            });
        }

      
    }

    getPublicServiceDetail(): void {
        this.publicServiceLoaded = false;
        this.publicService.getPublicService(+this.id).pipe(
            take(1),
            flatMap(async (res: IRespuestaApiSIUSingle) => {
                if (res && res.data) {
                    res.data.phonesStr = null;
                    if(res.data.phones && res.data.phones.length > 0){
                        res.data.phonesStr = res.data.phones.map(phone => phone.phone_number).toString().replace(/,/gi, ' - ');
                    }
                    if (res.data.ubication.latitude && res.data.ubication.longitude && this.currentPosition ) {
                        if(!this.showSimpleMap){
                            res.data.distance = roundDecimal(getDistanceInKm(this.currentPosition.latitude, this.currentPosition.longitude, res.data.ubication.latitude, res.data.ubication.longitude));
                        }else{
                            res.data.distance = null; 
                        }
                    }
                }
                return res;
            }),
            pluck('data'),
            catchError((error_http: HttpErrorResponse) => {
                this.errorService.manageHttpError(error_http, 'Ocurrio un error al cargar el detalle del servicio')
                return of(null);
            }),
        ).subscribe((res: IPublicService) => {
            this.publicServiceDetail = res;
            this.publicServiceLoaded = true;
        });
    }

    manageMapEvent(event: AppMapEvent): void {
        if (event && event.loaded) {
            this.mapLoaded = true;
        }
    }
}
