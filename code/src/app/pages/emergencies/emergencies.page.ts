import { Component, OnInit } from '@angular/core';
import { NavController, ModalController, ActionSheetController } from "@ionic/angular";
import { UtilsService } from "src/app/services/utils.service";
import { PostsService } from "src/app/services/posts.service";
import { IBasicFilter, IRespuestaApiSIUPaginada, ITokenDecoded } from "src/app/interfaces/models";
import { FilterPage } from "src/app/modals/filter/filter.page";
import { SearchPage } from "src/app/modals/search/search.page";
import { environment } from 'src/environments/environment';
import { finalize, delay, retryWhen, map } from 'rxjs/operators';
import { getJSON, mapEmergency } from "src/app/helpers/utils";
import { AuthService } from 'src/app/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'app-emergencies',
    templateUrl: './emergencies.page.html',
    styleUrls: ['./emergencies.page.scss'],
})
export class EmergenciesPage implements OnInit {

    emergenciesList = [];
    AuthUser = null;
    emergenciesFiltered = [];
    emergenciesLoaded = false;
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
        private actionSheetCtrl: ActionSheetController
    ) { }


    ngOnInit() {
        this.utilsService.enableMenu();
        this.authService.sessionAuthUser.subscribe(async (token_decoded: ITokenDecoded) => {
            if (token_decoded) {
                this.AuthUser = token_decoded.user;
                console.log(this.AuthUser);
            }
        });
        this.loadEmergencies();
    }


    ionViewWillEnter() {}

    loadEmergencies(event?: any) {
        this.emergenciesLoaded = false;
        this.postsService.getEmergenciesByUser().pipe(
            map((res: any) => {
                // console.log('res map', res);
                if (res && res.data && res.data.data) {
                    // const emergencies_to_map = res.data.data;
                    res.data.data.forEach((emergency: any) => {
                        emergency = mapEmergency(emergency);
                    });
                }
                console.log('res maped', res.data.data);
                return res;
            }),
            finalize(() => {
                this.emergenciesLoaded = true;
            }),
        ).subscribe((res: IRespuestaApiSIUPaginada) => {
            let emergenciesApi = [];
            emergenciesApi = res.data.data;

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

    getFullDate(date: string, time: string) {
        const fulldate = `${date} ${time}`;
        return fulldate;
    }

    postDetail(id: number) {
        this.navCtrl.navigateForward(`/emergency-detail/${id}`);
    }



    async showModalFilterEmergencies() {
        const modal = await this.modalCtrl.create({
            component: FilterPage,
            componentProps: {
                data: [...this.emergenciesList],
                filters: this.filters
            }
        });
        //Obtener datos popover cuando se vaya a cerrar
        modal.onDidDismiss().then((modalReturn: any) => {
            // console.dir(dataReturned);
            // console.log('data', dataReturned);
            if (modalReturn.data) {
                this.emergenciesFiltered = [...modalReturn.data.dataFiltered];
                this.filters = modalReturn.data.filters;
            }
            console.log('Data Returned Modal Filter', modalReturn.data);
        });
        await modal.present();
    }

    async showModalSearchEmergencies() {
        const modal = await this.modalCtrl.create({
            component: SearchPage,
            componentProps: {
                // data: [...this.emergencies],
                searchPlaceholder: 'Buscar Emergencias',
                searchIdeas: [],
                originalSearchData: [...this.emergenciesList],
                routeDetail: '/emergency-detail',
                fieldsToSearch: ['title', 'description'],
                searchInApi: true,
                postTypeSlug: environment.emergenciesSlug
                // filters: this.filters
            }
        });
        await modal.present();
    }

    reportEmergency() {
        this.navCtrl.navigateForward('/emergency-create');
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


}
