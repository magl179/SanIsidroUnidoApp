import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController } from "@ionic/angular";
import { UtilsService } from "src/app/services/utils.service";
import { PostsService } from "src/app/services/posts.service";
import { IRespuestaApiSIUPaginada, ITokenDecoded, IResource, IUser } from "src/app/interfaces/models";
import { finalize, map, catchError, pluck, distinctUntilChanged, tap, exhaustMap, share, startWith, skip, switchMap, takeUntil } from 'rxjs/operators';
import { mapEmergency } from "src/app/helpers/utils";
import { AuthService } from 'src/app/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { EventsService } from "src/app/services/events.service";
import { ErrorService } from 'src/app/services/error.service';
import { Router, ActivatedRoute } from '@angular/router';
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

    AuthUser: IUser = null;
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
    postState = 1;
    allPosts = false;
    showSegment =  false;
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
      
        //Peticion
        const peticionHttpBusqueda = (body) => {
            console.log('peticion body', body)
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
       
        //Si es Policia
        this.activatedRoute.queryParams.subscribe(params => {
            // this.queryParam = params['all'];
            this.allPosts = (params['all'] && params['all'] == 'all') ? true: false;
            if(this.allPosts){
                this.extraData.user = '';
            }else{
                this.extraData.user = this.AuthUser.id.toString();
            }
            console.log('this.extraData', this.extraData)
             //Policia
            if(this.isPolicia){
                this.showSegment = true;
            }
            else if(this.allPosts){
                this.showSegment = false;
            }
            else{
                this.showSegment = true;
            }
             //Primera Carga
            this.loadEmergencies(null, true);
        });
       
        //Simular Un Refresh cuando se crea nuevas emergencias
        this.events_app.emergenciesEmitter.subscribe(() => {
            this.postsService.resetPagination(this.postsService.PaginationKeys.EMERGENCIES);
            this.loadEmergencies({
                type: 'refresher',
                data: event
            });
        })
        //Buscador       
        combineLatest(
            this.emergencyControl.valueChanges.pipe(startWith(''), distinctUntilChanged()),
            this.segmentFilter$.asObservable().pipe(distinctUntilChanged()),
        )
            .pipe(
                skip(1),
                tap((val) => console.log('combine lastes',  val)),
                tap((val) => {
                    this.searchingEmergencies = true;
                }),
                map(combineValues => ({
                    category: CONFIG.EMERGENCIES_SLUG,
                    title: combineValues[0],
                    status_attendance: combineValues[1],
                    active: this.postState,
                    user: this.extraData.user,
                    police: this.extraData.police
                })),
                switchMap(peticionHttpBusqueda),
                takeUntil(this.unsubscribe)
            )
            .subscribe((data) => {
                this.showNotFound = (data.length == 0) ? true : false;
                this.emergenciesFiltered = [...data];
                this.searchingEmergencies = false;
            });
    }

    getEmergenciesFunction() {
        const params = {active: this.postState}
        if (this.isPolicia || this.allPosts) {
        } else {
            params['user'] = this.AuthUser.id;
        }
        console.log('getEmergenciesFunction', params)
        return this.postsService.getEmergencies(params);
    }

    async loadEmergencies(event = null, first_loading = false) {
       
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
            finalize(() => {
                if (first_loading) {
                    this.showloading = false;
                }
                if (first_loading && this.emergenciesList.length === 0) {
                    this.showNotFound = true;
                }

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
        if(value == 'rechazado'){
            this.postState = 0
        }else{
            this.postState = 1;
        }
        console.log('segment changed', value)
        this.segmentFilter$.next(value);
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
        this.postsService.resetPagination(this.postsService.PaginationKeys.EMERGENCIES);
    }

    ionViewWillLeave(){
        this.unsubscribe.next();
        this.unsubscribe.complete();
        this.postsService.resetPagination(this.postsService.PaginationKeys.EMERGENCIES);
    }


}
