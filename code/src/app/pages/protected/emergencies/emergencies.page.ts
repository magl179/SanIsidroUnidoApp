import { Component, OnInit } from '@angular/core';
import { NavController, ModalController } from "@ionic/angular";
import { UtilsService } from "src/app/services/utils.service";
import { PostsService } from "src/app/services/posts.service";
import { IBasicFilter } from "../../../interfaces/models";
import { FilterPage } from "../../../modals/filter/filter.page";
import { SearchPage } from "../../../modals/search/search.page";

@Component({
    selector: 'app-emergencies',
    templateUrl: './emergencies.page.html',
    styleUrls: ['./emergencies.page.scss'],
})
export class EmergenciesPage implements OnInit {

    emergencies = [];
    emergenciesFiltered = [];
    filters: IBasicFilter = {
        is_attended: {
            name: 'Estado',
            value: "",
            options: [
                { id: 1, name: 'Atendidos' },
                { id: 0, name: 'Pendientes' }
            ]
        }
    };

    searchingEmergencies= false;
    // eventsList: IEvent[] = [];
    textoEmergenciaBuscar = '';

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
        this.postsService.getEmergenciesByUser().subscribe((res:any)=> {
            if (res.data) {
                console.log('data', res);
                if (res.data.data.length === 0) {
                    if (event) {
                        event.target.disabled = true;
                        event.target.complete();
                    }
                    return;
                }
                this.emergencies.push(...res.data.data);
                this.emergenciesFiltered.push(...this.emergencies);
                console.log(this.emergencies);
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
        this.emergencies = [];
        this.postsService.resetEmergenciesPage();
    }

    async showModalFilterEmergencies() {
        const modal = await this.modalCtrl.create({
            component: FilterPage,
            componentProps: {
                data: [...this.emergencies],
                filters: this.filters
            }
        });
         //Obtener datos popover cuando se vaya a cerrar
        modal.onDidDismiss().then((dataReturned: any) => {
            console.dir(dataReturned);
            if (dataReturned && dataReturned.data.data && dataReturned.data.filters) {
                this.emergenciesFiltered = [...dataReturned.data.data];
                console.log('Data Returned Modal Filter', [...dataReturned.data.data]);
                console.log('Data Returned Modal Filterdespues', this.emergenciesFiltered);
                this.filters = dataReturned.data.filters;
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
                originalSearchData: [...this.emergencies],
                routeDetail: '/emergency-detail',
                fieldsToSearch : ['title','description']
                // filters: this.filters
            }
        });
        await modal.present();
    }

}
