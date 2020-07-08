import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController } from "@ionic/angular";
import { UtilsService } from "src/app/services/utils.service";
import { PostsService } from "src/app/services/posts.service";
import { IRespuestaApiSIUPaginada, ITokenDecoded, IResource, IUser } from "src/app/interfaces/models";
import { map, catchError, pluck, distinctUntilChanged, tap, share, startWith, skip, switchMap, takeUntil, debounceTime } from 'rxjs/operators';
import { mapEmergency } from "src/app/helpers/utils";
import { AuthService } from 'src/app/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { EventsService } from "src/app/services/events.service";
import { ErrorService } from 'src/app/services/error.service';
import { Router, ActivatedRoute } from '@angular/router';
import { of, BehaviorSubject, Subject, Observable } from 'rxjs';
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


    requestStatus = '';

    AuthUser: IUser = null;
    emergenciesList = [];
    emergenciesFiltered = [];
    isPolicia = false;
    emergencyControl: FormControl;
    segmentFilter$ = new BehaviorSubject(null);

    filters$ = new BehaviorSubject({
        police: '',
        user: '',
        category: CONFIG.EMERGENCIES_SLUG,
        title: '',
        status_attendance: '',
        active: 1,
        is_police: null
    });

    allPosts = false;
    showSegment = false;
    private unsubscribe = new Subject<void>();

    constructor(
        private navCtrl: NavController,
        private authService: AuthService,
        private utilsService: UtilsService,
        private errorService: ErrorService,
        private postsService: PostsService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private events_app: EventsService
    ) {
        this.emergencyControl = new FormControl();
    }

    async ngOnInit() {
       
        const peticionHttpBusqueda = (body) => {
            return this.postsService.searchPosts(body)
                .pipe(
                    pluck('data'),
                    map(data => {
                        const emergencies_to_map = data
                        emergencies_to_map.forEach((emergency) => {
                            emergency = mapEmergency(emergency);
                        });
                        return emergencies_to_map;
                    }),
                    catchError((error_http: HttpErrorResponse) => {
                        this.errorService.manageHttpError(error_http, '');
                        return of([])
                    }),
                    takeUntil(this.unsubscribe)
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

        this.emergencyControl.valueChanges.pipe(startWith(''),
        debounceTime(400),
        distinctUntilChanged())
        .subscribe(value =>{
             this.filters$.next({ ... this.filters$.value, title: value })
        });

        //Si es Policia
        this.activatedRoute.queryParams.subscribe(params => {
            
            this.allPosts = (params['all'] && params['all'] == 'all') ? true : false;
            let status_attendance = '';
            let isPolice = null;
            let active = 1;
            //Policia
            if (this.allPosts) {
                this.showSegment = false;
                status_attendance = 'atendido';
            } else {
                this.showSegment = true;
            }
            if (this.allPosts && this.isPolicia) {
                this.showSegment = false;
                status_attendance = '';
                isPolice = 1;
                active = null;
            }

            if (!this.allPosts && !this.isPolicia) {
                this.showSegment = true;
                status_attendance = '';
                active = null;
            }

            if (this.allPosts) {
                this.filters$.next({ ... this.filters$.value, user: '', status_attendance, is_police: isPolice, active });
            } else {
                this.filters$.next({ ... this.filters$.value, user: this.AuthUser.id.toString(), is_police: isPolice, active })
            }

            //Primera Carga
            this.loadEmergencies(null, true);
        });
        
        //Buscador   
        this.notifyFilters()
            .pipe(
                skip(1),
                switchMap(peticionHttpBusqueda),
                tap(() => {
                    this.requestStatus = 'loading';
                }),
            )
            .subscribe((data) => {
                this.requestStatus = '';
                this.requestStatus =  (data.length == 0) ? 'not-found': '';
                // this.emergenciesList
                this.emergenciesFiltered = [...data];
            });
    }

    imgError(event, url = "assets/img/default/image_full.png"): void {
        event.target.src = url;
    }

    getEmergenciesFunction() {
        return this.postsService.getEmergencies(this.filters$.value);
    }

    async loadEmergencies(event = null, first_loading = false) {
        if(!event){
            this.requestStatus = 'loading';
        }
        this.getEmergenciesFunction().pipe(
            map((res: IRespuestaApiSIUPaginada) => {
                if (res && res.data) {
                    res.data.forEach((emergency) => {
                        emergency = mapEmergency(emergency);
                    });
                }
                if (res && res.data && res.data.length == 0) {
                    this.postsService.resetPaginationEmpty(this.postsService.PaginationKeys.EMERGENCIES)
                }
                return res;
            }),
            catchError((error_http: HttpErrorResponse) => {
                this.errorService.manageHttpError(error_http, 'Ocurrio un error al traer el listado de emergencias', false);
                this.postsService.resetPaginationEmpty(this.postsService.PaginationKeys.EMERGENCIES);
                return of({ data: [] })
            }),
            takeUntil(this.unsubscribe)
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

            this.requestStatus = '';

            if (event && event.type == 'refresher') {
                this.emergenciesList.unshift(...emergenciesApi);
                this.emergenciesFiltered.unshift(...emergenciesApi);
                if(this.emergenciesFiltered.length == 0){
                    this.requestStatus = 'not-found';
                }else{
                    this.requestStatus = '';
                }
                return;
            } else if (event && event.type == 'infinite_scroll') {
                this.emergenciesList.push(...emergenciesApi);
                this.emergenciesFiltered.push(...emergenciesApi);
                if(this.emergenciesFiltered.length == 0){
                    this.requestStatus = 'not-found';
                }else{
                    this.requestStatus = '';
                }
                return;
            } else {
                this.emergenciesList.push(...emergenciesApi);
                this.emergenciesFiltered.push(...this.emergenciesList);
                if(this.emergenciesFiltered.length == 0){
                    this.requestStatus = 'not-found';
                }else{
                    this.requestStatus = '';
                }
                return;
            }
        });
    }

    getImages($imagesArray: IResource[]) {
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

    getInfiniteScrollData(event) {
        this.loadEmergencies({
            type: 'infinite_scroll',
            data: event
        });
    }
    //Obtener datos con Refresher
    doRefresh(event) {
        this.loadEmergencies({
            type: 'refresher',
            data: event
        });
    }

    segmentChanged(event: CustomEvent) {
        const value = (event.detail.value !== "") ? event.detail.value : "";
        if (value == 'rechazado') {
            this.filters$.next({ ...this.filters$.value, active: 0, status_attendance: value });
        } else {
            this.filters$.next({ ...this.filters$.value, active: 1, status_attendance: value });
        }
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
        this.postsService.resetPagination(this.postsService.PaginationKeys.EMERGENCIES);
        this.emergenciesList = [];
        this.emergenciesFiltered = [];
    }

    ionViewWillLeave() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
        this.postsService.resetPagination(this.postsService.PaginationKeys.EMERGENCIES);
        this.emergenciesList = [];
        this.emergenciesFiltered = [];
    }

    notifyFilters(): Observable<any>{
        return this.filters$.asObservable().pipe();
    }

}
