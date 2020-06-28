import { Component, OnInit } from '@angular/core';
import { UtilsService } from 'src/app/services/utils.service';
import { IPublicService } from 'src/app/interfaces/models';
import { ModalController, NavController } from "@ionic/angular";
import { finalize, take, map, tap, distinctUntilChanged } from 'rxjs/operators';
import { IRespuestaApiSIU } from "src/app/interfaces/models";
import { getRandomColor } from 'src/app/helpers/utils';
import { PublicService } from 'src/app/services/public.service';
import { ActivatedRoute } from '@angular/router';
import { ErrorService } from 'src/app/services/error.service';
import { FormControl } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { trigger,style,transition,animate,keyframes,query,stagger } from '@angular/animations';

@Component({
    selector: 'siu-public-services-list',
    templateUrl: './public-services-list.page.html',
    styleUrls: ['./public-services-list.page.scss'],
    animations: [
        trigger('listAnimation', [
          transition('* => *', [
            query(':enter', style({ opacity: 0 }), {optional: true}),
            query(':enter', stagger('300ms', [
              animate('1s ease-in', keyframes([
                style({opacity: 0, transform: 'translateY(-75%)', offset: 0}),
                style({opacity: .5, transform: 'translateY(35px)',  offset: 0.3}),
                style({opacity: 1, transform: 'translateY(0)',     offset: 1.0}),
              ]))]), {optional: true}),
          ])
        ])
      ]
})
export class PublicServicesListPage implements OnInit {

    publicServices: IPublicService[] = [];
    filterPublicServices = [];
    publicServiceSelected = null;
    currentLocation = null;
    markerSelected = false;
    publicServicesLoaded = false;
    category: string;
    publicServicesFilter: IPublicService[] = [];
    publicServiceSearchControl: FormControl;
    searchingPublicServices = false;

    constructor(
        private activatedRoute: ActivatedRoute,
        private publicService: PublicService,
        private navCtrl: NavController,
        private errorService: ErrorService,
        private modalCtrl: ModalController
    ) { 
        this.publicServiceSearchControl = new FormControl();
    }

    imgError(event, url="assets/img/default/not-found.jpg"): void {
        event.target.src = url;
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
                const searchValue = search.toLowerCase();
                this.publicServicesFilter = [...this.publicServices].filter(public_service => {
                    const name = public_service.name.toLowerCase();
                    return name.indexOf(searchValue) > -1;
                })
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
        }, (error_http: HttpErrorResponse) => {
            this.errorService.manageHttpError(error_http, 'Ocurrio un error al cargar el listado de serviciós públicos')
        });
    }

    goToDetail(id: number) {
        const url = `/public-services/list/${this.category}/${id}`;
        this.navCtrl.navigateForward(url);
    }
}
