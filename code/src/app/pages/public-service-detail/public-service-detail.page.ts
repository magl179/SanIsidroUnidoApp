import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { IRespuestaApiSIUSingle } from 'src/app/interfaces/models';
import { PublicService } from "src/app/services/public.service";
import { take, map, finalize, flatMap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { LocalizationService } from "../../services/localization.service";
import { getDistanceInKm, roundDecimal } from 'src/app/helpers/utils';

@Component({
  selector: 'app-public-service-detail',
  templateUrl: './public-service-detail.page.html',
  styleUrls: ['./public-service-detail.page.scss'],
})
export class PublicServiceDetailPage implements OnInit {

    id: string;
    publicServiceLoaded = false;
    publicServiceDetail = null;
    mapLoaded = false;


    constructor(
        private route: ActivatedRoute,
        private localizationService: LocalizationService,
        private publicService: PublicService
  ) { }

    ngOnInit() {
        this.id = this.route.snapshot.paramMap.get('id');
        this.getPublicServiceDetail();
    }
    
    getPublicServiceDetail() {
        this.publicServiceLoaded = false;
        this.publicService.getPublicService(+this.id).pipe(
            take(1),
            flatMap(async (res: IRespuestaApiSIUSingle) => {
                if (res && res.data) {
                    const currentPosition = await this.localizationService.getCoordinate();
                    if (res.data.ubication.latitude && res.data.ubication.longitude) {
                        res.data.distance = roundDecimal(getDistanceInKm(currentPosition.latitude, currentPosition.longitude, res.data.ubication.latitude, res.data.ubication.longitude));
                    }
                }
                return res;
            }),
            finalize(() => {
            this.publicServiceLoaded = true;
            })
        ).subscribe((res: IRespuestaApiSIUSingle) => {
            this.publicServiceDetail = res.data;
            console.log('Dato post', this.publicServiceDetail);
        },(err: HttpErrorResponse) => {
            if (err.error instanceof Error) {
                console.log("Client-side error", err);
            } else {
                console.log("Server-side error", err);
            }
        });
    }

    manageMapEvent(event: any) {
        console.log(event);
        if (event && event.loaded) {
            this.mapLoaded = true;
        }
    }

}
