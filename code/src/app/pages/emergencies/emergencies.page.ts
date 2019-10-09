import { Component, OnInit } from '@angular/core';
import { NavController, ModalController, ActionSheetController } from "@ionic/angular";
import { UtilsService } from "src/app/services/utils.service";
import { PostsService } from "src/app/services/posts.service";
import { IBasicFilter, IRespuestaApiSIUPaginada, ITokenDecoded } from "src/app/interfaces/models";
import { FilterPage } from "src/app/modals/filter/filter.page";
import { SearchPage } from "src/app/modals/search/search.page";
import { environment } from 'src/environments/environment';
import { finalize,delay, retryWhen, map } from 'rxjs/operators';
import { getJSON, mapEmergency } from "src/app/helpers/utils";
import { AuthService } from 'src/app/services/auth.service';

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
    }

    ionViewWillEnter() {
        this.utilsService.enableMenu();
        this.postsService.resetEmergenciesPage();
        this.authService.sessionAuthUser.subscribe(async(token_decoded: ITokenDecoded) => {
            // console.log('token decoded', token_decoded)
            // console.log('token decoded VERIFY', (token_decoded.user) ? 'true' : 'false');
            if (token_decoded) {
                this.AuthUser = token_decoded.user;
                console.log(this.AuthUser);
                // this.getRoles();
            }
        });
        this.loadEmergencies(null, true);
    }

    // async showActionCtrl(emergency) {
    //     const actionToggleAssistance = {
    //         text: (emergency.postAssistance) ? 'Unirme' : 'Ya no me interesa',
    //         icon: 'clipboard',
    //         cssClass: ['toggle-assistance'],
    //         handler: () => {
    //             console.log('Favorito Borrado');
    //             this.toggleAssistance(event.postAssistance, event.id);
    //         }
    //     }

    //     const actionSheet = await this.actionSheetCtrl.create({
    //         buttons: [
    //             actionToggleAssistance, {
    //                 text: 'Cancelar',
    //                 icon: 'close',
    //                 cssClass: ['cancel-action'],
    //                 role: 'cancel',
    //                 handler: () => {
    //                     console.log('Cancel clicked');
    //                 }
    //             }
    //         ]
    //     });
    //     await actionSheet.present();
    // }

    loadEmergencies(event?: any, resetEvents?: any) {
        if (resetEvents) {
            this.emergenciesList = [];
            this.postsService.resetEventsPage();
        }
        this.emergenciesLoaded = false;
        this.postsService.getEmergenciesByUser().pipe(
            map((res: any) => {
                // console.log('res map', res);
                if (res && res.data && res.data.data) {
                    const emergencies_to_map = res.data.data;
                    emergencies_to_map.forEach((emergency: any) => {
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
            if (emergenciesApi) {
                if (emergenciesApi.length === 0) {
                    if (event) {
                        event.target.disabled = true;
                        event.target.complete();
                    }
                    return;
                }
                this.emergenciesList.push(...emergenciesApi);
                this.emergenciesFiltered.push(...this.emergenciesList);
                console.log(this.emergenciesList);
                if (event) {
                    event.target.complete();
                }
            }
        },
        (err: any) => {
            console.log(err);
            this.utilsService.showToast('No se pudieron cargar tus emergencias');
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
            if (modalReturn.data && modalReturn.data.data && modalReturn.data.filters) {
                this.emergenciesFiltered = [...modalReturn.data.data];
                console.log('Data Returned Modal Filter', [...modalReturn.data.data]);
                console.log('Data Returned Modal Filterdespues', this.emergenciesFiltered);
                this.filters = modalReturn.data.filters;
            }
             //console.log('Data Returned Modal Filter', this.emergenciesFiltered);
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


}
