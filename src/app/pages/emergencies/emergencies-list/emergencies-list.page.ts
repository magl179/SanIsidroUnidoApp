import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController, ModalController } from "@ionic/angular";
import { UtilsService } from "src/app/services/utils.service";
import { PostsService } from "src/app/services/posts.service";
import { IBasicFilter, IRespuestaApiSIUPaginada, ITokenDecoded } from "src/app/interfaces/models";
import { finalize, map, takeUntil } from 'rxjs/operators';
import { mapEmergency, setFilterKeys, filterDataInObject } from "src/app/helpers/utils";
import { AuthService } from 'src/app/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { EventsService } from "src/app/services/events.service";
import { ErrorService } from 'src/app/services/error.service';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Component({
    selector: 'app-emergencies-list',
    templateUrl: './emergencies-list.page.html',
    styleUrls: ['./emergencies-list.page.scss'],
})
export class EmergenciesListPage implements OnInit, OnDestroy {

    //Desuscribir
    private unsubscribe$ = new Subject<void>();
    AuthUser = null;
    showloading = true;   
    showNotFound = false; 
    emergenciesList = [];
    emergenciesFiltered = [];

    filtersToApply: any = { is_attended: ""};
    filters: IBasicFilter = {
        is_attended: {
            name: 'Estado',
            value: "",
            type: 'segment', //select //radio
            options: [
                { id: 1, name: 'Atendidos' },
                { id: 0, name: 'Pendientes' }
            ]
        }
    };

    constructor(
        private navCtrl: NavController,
        private authService: AuthService,
        private utilsService: UtilsService,
        private errorService: ErrorService,
        private postsService: PostsService,
        private router: Router,
        private events_app: EventsService
    ) { }

    redirectToSearch(){
        this.navCtrl.navigateRoot("/emergencies/search", {
            queryParams: { redirectUrl: this.router.url }
        });
    }

    ngOnInit() {
        this.postsService.resetEmergenciesPage();
        this.utilsService.enableMenu();
        this.authService.sessionAuthUser.subscribe(async (token_decoded: ITokenDecoded) => {
            if (token_decoded) {
                this.AuthUser = token_decoded.user;
            }
        });
        //Primera Carga
        this.loadEmergencies(null,true);
        //Simular Un Refresh cuando se crea nuevas emergencias
        this.events_app.emergenciesEmitter.subscribe((event_app: any) => {
            this.postsService.resetEmergenciesPage();
            this.loadEmergencies({
                type: 'refresher',
                data: event
            });
        })
    }

    ngOnDestroy() {
        //Desuscribirnos de los Observables al destruir el componente
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
    ionViewWillEnter() { }
    ionViewWillLeave() { this.postsService.resetEmergenciesPage(); }

    loadEmergencies(event: any = null, first_loading=false) {
        this.postsService.getEmergenciesByUser().pipe(
            map((res: IRespuestaApiSIUPaginada) => {
                if (res && res.data) {
                    res.data.forEach((emergency: any) => {
                        emergency = mapEmergency(emergency);
                    });
                }
                return res;
            }),
            finalize(() => {
                if(first_loading){
                    this.showloading = false;
                }
                if(first_loading && this.emergenciesList.length === 0){
                    this.showNotFound = true;
                } 
            }),
            takeUntil(this.unsubscribe$) //Marcar como completada una suscripción
        ).subscribe((res: IRespuestaApiSIUPaginada) => {
            let emergenciesApi = [];
            emergenciesApi = res.data;

            if (emergenciesApi.length === 0) {
                if (event && event.data && event.data.target && event.data.target.complete) {
                    event.data.target.disabled = true;
                    event.data.target.complete();
                }
                return;
            }
            if (event && event.data && event.data.target && event.data.target.complete) {                
                event.data.target.complete();
            }
            if (event && event.type == 'refresher') {
                this.emergenciesList.unshift(...emergenciesApi);;
                this.emergenciesFiltered.unshift(...emergenciesApi);
                return;
            }else if(event && event.type == 'infinite_scroll'){
                this.emergenciesList.push(...emergenciesApi);
                this.emergenciesFiltered.push(...this.emergenciesList);
            }else{
                this.emergenciesList.push(...emergenciesApi);
                this.emergenciesFiltered.push(...this.emergenciesList);
            }
        },(err: HttpErrorResponse) => {
            this.errorService.manageHttpError(err, 'Ocurrio un error al traer el listado de emergencias');
        });
    }

    getImages($imagesArray: any[]) {
        if ($imagesArray) {
            if ($imagesArray.length === 0) {
                return '';
            } else {
                return $imagesArray[0].url;
            }
        } else {
            return '';
        }
    }

    postDetail(id: number) {
        this.navCtrl.navigateForward(`/emergencies/detail/${id}`);
    }
    
    getInfiniteScrollData(event: any) {
        this.loadEmergencies({
            type: 'infinite_scroll',
            data: event
        });
    }
    //Obtener datos con Refresher
    doRefresh(event: any) {
        this.loadEmergencies({
            type: 'refresher',
            data: event
        });
    }

    segmentChanged(event: any) {
        const value = (event.detail.value !== "") ? Number(event.detail.value) : "";
        const type = 'is_attended';
        if (value !== "") {
            const filterApplied = setFilterKeys({...this.filtersToApply}, type, value);
            this.filtersToApply = filterApplied;
            this.emergenciesFiltered = filterDataInObject([...this.emergenciesList], {...this.filtersToApply});
        } else {
            this.emergenciesFiltered = this.emergenciesList;
        }
    }

    


}
