import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController } from "@ionic/angular";
import { UtilsService } from "src/app/services/utils.service";
import { PostsService } from "src/app/services/posts.service";
import { IBasicFilter, IRespuestaApiSIUPaginada, ITokenDecoded } from "src/app/interfaces/models";
import { finalize, map, catchError } from 'rxjs/operators';
import { mapEmergency, setFilterKeys, filterDataInObject } from "src/app/helpers/utils";
import { AuthService } from 'src/app/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { EventsService } from "src/app/services/events.service";
import { ErrorService } from 'src/app/services/error.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';

@Component({
    selector: 'app-emergencies-list',
    templateUrl: './emergencies-list.page.html',
    styleUrls: ['./emergencies-list.page.scss'],
})
export class EmergenciesListPage implements OnInit, OnDestroy {

    AuthUser = null;
    showloading = true;   
    showNotFound = false; 
    emergenciesList = [];
    emergenciesFiltered = [];
    //Request
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
    isPolicia = false;

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

    async ngOnInit() {       
        //Verificar si es policia
        this.isPolicia = await this.authService.userHasRole(['Policia']);

        //this.postsService.resetEmergenciesPage();
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
            this.postsService.resetPagination(this.postsService.PaginationKeys.EMERGENCIES);
            this.loadEmergencies({
                type: 'refresher',
                data: event
            });
        })
    }

    ngOnDestroy() {
        //Desuscribirnos de los Observables al destruir el componente
        console.warn('ng on destroy emergencies')
        this.postsService.resetPagination(this.postsService.PaginationKeys.EMERGENCIES);
    }

    getEmergenciesFunction(params={}){
        if(this.isPolicia){
            return this.postsService.getEmergencies(params);
        }else{
            return this.postsService.getEmergenciesByUser(params);
        }
    }

    async loadEmergencies(event: any = null, first_loading=false) { 
        const params = (this.isPolicia) ? {police: this.AuthUser.id}: {}
        
        this.getEmergenciesFunction(params).pipe(
            map((res: IRespuestaApiSIUPaginada) => {
                if (res && res.data) {
                    res.data.forEach((emergency: any) => {
                        emergency = mapEmergency(emergency);
                    });
                }
                if(res && res.data && res.data.length == 0){
                    this.postsService.resetPaginationEmpty(this.postsService.PaginationKeys.EMERGENCIES)
                }
                return res;
            }),
            catchError((err: HttpErrorResponse)=>{
                this.errorService.manageHttpError(err, 'Ocurrio un error al traer el listado de emergencias', false);
                this.postsService.resetPaginationEmpty(this.postsService.PaginationKeys.EMERGENCIES);
                return of({data: []})
            }),
            finalize(() => {
                console.warn('finalize', this.postsService.getAllPagination())
                if(first_loading){
                    this.showloading = false;
                }
                if(first_loading && this.emergenciesList.length === 0){
                    this.showNotFound = true;
                } 
                               
            }),
        ).subscribe((res: IRespuestaApiSIUPaginada) => {
            let emergenciesApi = [];
            emergenciesApi = res.data;
            console.log('emergenciesApi', emergenciesApi)
            //Evento Completar
            if(event && event.data && event.data.target && event.data.target.complete){
                event.data.target.complete();
            }         
            if(event && event.data && event.data.target && event.data.target.complete && emergenciesApi.length == 0){
                event.data.target.disabled = true;
            }         
            if (event && event.type == 'refresher') {
                this.emergenciesList.unshift(...emergenciesApi);
                this.emergenciesFiltered.unshift(...emergenciesApi);
                return;
            }else if(event && event.type == 'infinite_scroll'){
                this.emergenciesList.push(...emergenciesApi);
                this.emergenciesFiltered.push(...emergenciesApi);
                return;
            }else{
                this.emergenciesList.push(...emergenciesApi);
                this.emergenciesFiltered.push(...this.emergenciesList);
                return;
            }
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
