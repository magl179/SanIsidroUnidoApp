import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController, ModalController, ActionSheetController } from "@ionic/angular";
import { UtilsService } from "src/app/services/utils.service";
import { PostsService } from "src/app/services/posts.service";
import { IBasicFilter, IRespuestaApiSIUPaginada, ITokenDecoded } from "src/app/interfaces/models";
import { FilterPage } from "src/app/modals/filter/filter.page";
import { SearchPage } from "src/app/modals/search/search.page";
import { environment } from 'src/environments/environment';
import { finalize, delay, retryWhen, map } from 'rxjs/operators';
import { getJSON, mapEmergency, setFilterKeys, filterDataInObject } from "src/app/helpers/utils";
import { AuthService } from 'src/app/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { EventsService } from "src/app/services/events.service";

@Component({
    selector: 'app-emergencies',
    templateUrl: './emergencies.page.html',
    styleUrls: ['./emergencies.page.scss'],
})
export class EmergenciesPage implements OnInit, OnDestroy {

    emergenciesList = [];
    AuthUser = null;
    emergenciesFiltered = [];
    emergenciesLoaded = false;
    
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
        private postsService: PostsService,
        private modalCtrl: ModalController,
        private events_app: EventsService
    ) { }


    ngOnInit() {
        this.postsService.resetEmergenciesPage();
        this.utilsService.enableMenu();
        this.authService.sessionAuthUser.subscribe(async (token_decoded: ITokenDecoded) => {
            if (token_decoded) {
                this.AuthUser = token_decoded.user;
            }
        });
        this.loadEmergencies();
        this.events_app.emergenciesEmitter.subscribe((event_app: any) => {
            if (this.emergenciesList.length > 0) {
                console.log('tengo datos cargados resetear a 0');
                this.emergenciesList = [];
                this.emergenciesFiltered = [];
                this.postsService.resetEmergenciesPage();
            }
            this.loadEmergencies();
        })
    }

    ngOnDestroy() { console.warn('emergencies PAGE DESTROYED') }
    ionViewWillEnter() { }
    ionViewWillLeave() { this.postsService.resetEmergenciesPage(); }

    loadEmergencies(event?: any) {
        this.emergenciesLoaded = false;
        this.postsService.getEmergenciesByUser().pipe(
            map((res: IRespuestaApiSIUPaginada) => {
                if (res && res.data) {
                    // const emergencies_to_map = res.data.data;
                    res.data.forEach((emergency: any) => {
                        emergency = mapEmergency(emergency);
                    });
                }
                return res;
            }),
            finalize(() => {
                this.emergenciesLoaded = true;
            }),
        ).subscribe((res: IRespuestaApiSIUPaginada) => {
            let emergenciesApi = [];
            emergenciesApi = res.data;
            if (emergenciesApi.length === 0) {
                if (event) {
                    event.data.target.disabled = true;
                    event.data.target.complete();
                }
                return;
            }
            if (event) {
                event.data.target.complete();
            }
            if (event && event.type === 'refresher') {
                this.emergenciesList.unshift(...emergenciesApi);
                this.emergenciesFiltered.unshift(...emergenciesApi);
                return;
            }
            this.emergenciesList.push(...emergenciesApi);
            this.emergenciesFiltered.push(...this.emergenciesList);


        },(err: HttpErrorResponse) => {
            if (err.error instanceof Error) {
                console.log("Client-side error", err);
            } else {
                console.log("Server-side error", err);
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
        this.navCtrl.navigateForward(`/emergencies-tabs/detail/${id}`);
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
