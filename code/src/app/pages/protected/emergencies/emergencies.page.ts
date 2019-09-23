import { Component, OnInit } from '@angular/core';
import { NavController, ModalController } from "@ionic/angular";
import { UtilsService } from "src/app/services/utils.service";
import { PostsService } from "src/app/services/posts.service";
import { IBasicFilter } from "../../../interfaces/models";
import { FilterPage } from "../../../modals/filter/filter.page";
import { SearchPage } from "../../../modals/search/search.page";
import { environment } from 'src/environments/environment';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'app-emergencies',
    templateUrl: './emergencies.page.html',
    styleUrls: ['./emergencies.page.scss'],
})
export class EmergenciesPage implements OnInit {

    emergenciesList = [];
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
        private utilsService: UtilsService,
        private postsService: PostsService,
        private modalCtrl: ModalController
    ) { }


    ngOnInit() {
    }

    reportEmergency() {
        this.navCtrl.navigateForward('/emergency-create');
    }

    ionViewWillEnter() {
        this.utilsService.enableMenu();
        this.loadEmergencies();
    }

    // ionViewWillLeave(){
    //     this.emergencies = [];
    //     this.postsService.resetEmergenciesPage();
    // }

    loadEmergencies(event?, resetEvents?) {
        // if (resetEvents) {
        //     this.postService.resetEventsPage();
        // }
        this.emergenciesLoaded = false;
        this.postsService.getEmergenciesByUser().pipe(
            finalize(() => {
                this.emergenciesLoaded = true;
            })
        ).subscribe((res:any)=> {
            if (res.data) {
                console.log('data', res);
                if (res.data.data.length === 0) {
                    if (event) {
                        event.target.disabled = true;
                        event.target.complete();
                    }
                    return;
                }
                this.emergenciesList.push(...res.data.data);
                this.emergenciesFiltered.push(...this.emergenciesList);
                console.log(this.emergenciesList);
                if (event) {
                    event.target.complete();
                }
            }
        },
        err => {
            console.log(err);
            this.utilsService.showToast('No se pudieron cargar tus emergencias');
        });
    }

    getImages($imagesArray) {
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

    getFullDate(date, time) {
        const fulldate = `${date} ${time}`;
        return fulldate;
    }
    
    postDetail(id) {
        this.resetEmergencies();
        this.navCtrl.navigateForward(`/emergency-detail/${id}`);;
    }
    

    resetEmergencies() {
        this.emergenciesList = [];
        this.postsService.resetEmergenciesPage();
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

    getHeaderBackData(event){
        if (event.wannaSearch) {
            this.showModalSearchEmergencies();
        }
        if (event.wannaFilter) {
            this.showModalFilterEmergencies();
        }
        if (event.wannaReport) {
            this.reportEmergency();
        }
    }

}
