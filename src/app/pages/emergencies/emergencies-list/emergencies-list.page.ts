import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController } from "@ionic/angular";
import { UtilsService } from "src/app/services/utils.service";
import { PostsService } from "src/app/services/posts.service";
import { IRespuestaApiSIUPaginada, ITokenDecoded } from "src/app/interfaces/models";
import { finalize, map, catchError, pluck, distinctUntilChanged, tap, exhaustMap, share, startWith, skip, switchMap } from 'rxjs/operators';
import { mapEmergency } from "src/app/helpers/utils";
import { AuthService } from 'src/app/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { EventsService } from "src/app/services/events.service";
import { ErrorService } from 'src/app/services/error.service';
import { Router } from '@angular/router';
import { of, BehaviorSubject, combineLatest, Subject } from 'rxjs';
import { trigger, style, transition, animate, keyframes, query, stagger } from '@angular/animations';
import { FormControl } from '@angular/forms';
import { CONFIG } from 'src/config/config';

@Component({
    selector: 'app-emergencies-list',
    templateUrl: './emergencies-list.page.html',
    styleUrls: ['./emergencies-list.page.scss'],
    animations: [
        trigger('listAnimation', [
            transition('* => *', [
                query(':enter', style({ opacity: 0 }), { optional: true }),
                query(':enter', stagger('300ms', [
                    animate('1s ease-in', keyframes([
                        style({ opacity: 0, transform: 'translateY(-75%)', offset: 0 }),
                        style({ opacity: .5, transform: 'translateY(35px)', offset: 0.3 }),
                        style({ opacity: 1, transform: 'translateY(0)', offset: 1.0 }),
                    ]))]), { optional: true }),
            ])
        ])
    ]
})
export class EmergenciesListPage implements OnInit, OnDestroy {

    AuthUser = null;
    showloading = true;
    showNotFound = false;
    emergenciesList = [];
    emergenciesFiltered = [];
    isPolicia = false;
    searchingEmergencies = false;
    emergencyControl: FormControl;
    segmentFilter$ = new BehaviorSubject(null);
    extraData = {
        police: '',
        user: ''
    };

    constructor(
        private navCtrl: NavController,
        private authService: AuthService,
        private utilsService: UtilsService,
        private errorService: ErrorService,
        private postsService: PostsService,
        private router: Router,
        private events_app: EventsService
    ) {
        this.emergencyControl = new FormControl();
    }

    redirectToSearch() {
        this.navCtrl.navigateRoot("/emergencies/search", {
            queryParams: { redirectUrl: this.router.url }
        });
    }

    async ngOnInit() {
        //Peticion
        const peticionHttpBusqueda = (body: any) => {
            return this.postsService.searchPosts(body)
                .pipe(
                    pluck('data'),
                    map(data => {
                        const emergencies_to_map = data
                        emergencies_to_map.forEach((emergency: any) => {
                            emergency = mapEmergency(emergency);
                        });
                        return emergencies_to_map;
                    }),
                    catchError(err => of([]))
                )
        };
        //Verificar si es policia
        this.isPolicia = await this.authService.userHasRole(['Policia']);
        this.utilsService.enableMenu();
        this.authService.sessionAuthUser.subscribe(async (token_decoded: ITokenDecoded) => {
            if (token_decoded) {
                this.AuthUser = token_decoded.user;
            }
        });
        //Si es Policia
        if(this.isPolicia){
            // this.extraData.police = this.AuthUser.id;
        }else{
            this.extraData.user = this.AuthUser.id;
        }
        //Primera Carga
        this.loadEmergencies(null, true);
        //Simular Un Refresh cuando se crea nuevas emergencias
        this.events_app.emergenciesEmitter.subscribe((event_app: any) => {
            this.postsService.resetPagination(this.postsService.PaginationKeys.EMERGENCIES);
            this.loadEmergencies({
                type: 'refresher',
                data: event
            });
        })
        //Buscador       
        combineLatest(
            this.emergencyControl.valueChanges.pipe(startWith('')),
            this.segmentFilter$.asObservable(),
        )
            .pipe(
                distinctUntilChanged(),
                skip(1),
                tap((val) => {
                    this.searchingEmergencies = true;
                }),
                map(combineValues => ({
                    category: CONFIG.EMERGENCIES_SLUG,
                    title: combineValues[0],
                    is_attended: combineValues[1],
                    ... this.extraData
                })),
                switchMap(peticionHttpBusqueda),
            )
            .subscribe((data: any[]) => {
                this.showNotFound = (data.length == 0) ? true : false;
                this.emergenciesFiltered = [...data];
                this.searchingEmergencies = false;
            });
    }

    ngOnDestroy() {
        //Desuscribirnos de los Observables al destruir el componente
        this.postsService.resetPagination(this.postsService.PaginationKeys.EMERGENCIES);
    }

    getEmergenciesFunction(params = {}) {
        if (this.isPolicia) {
            return this.postsService.getEmergencies(params);
        } else {
            return this.postsService.getEmergenciesByUser(params);
        }
    }

    async loadEmergencies(event: any = null, first_loading = false) {
        const params = (this.isPolicia) ? { } : {}

        this.getEmergenciesFunction(params).pipe(
            map((res: IRespuestaApiSIUPaginada) => {
                if (res && res.data) {
                    res.data.forEach((emergency: any) => {
                        emergency = mapEmergency(emergency);
                    });
                }
                if (res && res.data && res.data.length == 0) {
                    this.postsService.resetPaginationEmpty(this.postsService.PaginationKeys.EMERGENCIES)
                }
                return res;
            }),
            catchError((err: HttpErrorResponse) => {
                this.errorService.manageHttpError(err, 'Ocurrio un error al traer el listado de emergencias', false);
                this.postsService.resetPaginationEmpty(this.postsService.PaginationKeys.EMERGENCIES);
                return of({ data: [] })
            }),
            finalize(() => {
                if (first_loading) {
                    this.showloading = false;
                }
                if (first_loading && this.emergenciesList.length === 0) {
                    this.showNotFound = true;
                }

            }),
        ).subscribe((res: IRespuestaApiSIUPaginada) => {
            let emergenciesApi = [];
            emergenciesApi = res.data;
            //Evento Completar
            if (event && event.data && event.data.target && event.data.target.complete) {
                event.data.target.complete();
            }
            if (event && event.data && event.data.target && event.data.target.complete && emergenciesApi.length == 0) {
                event.data.target.disabled = true;
            }
            if (event && event.type == 'refresher') {
                this.emergenciesList.unshift(...emergenciesApi);
                this.emergenciesFiltered.unshift(...emergenciesApi);
                return;
            } else if (event && event.type == 'infinite_scroll') {
                this.emergenciesList.push(...emergenciesApi);
                this.emergenciesFiltered.push(...emergenciesApi);
                return;
            } else {
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
        this.navCtrl.navigateForward(`/emergencies/list/${id}`);
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
        this.segmentFilter$.next(value);
    }




}
