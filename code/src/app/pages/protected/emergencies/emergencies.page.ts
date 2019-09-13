import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { UtilsService } from "src/app/services/utils.service";
import { PostsService } from "src/app/services/posts.service";

@Component({
    selector: 'app-emergencies',
    templateUrl: './emergencies.page.html',
    styleUrls: ['./emergencies.page.scss'],
})
export class EmergenciesPage implements OnInit {

    emergencies = [];


    searchingEmergencies= false;
    emergenciesBusqueda = [];
    // eventsList: IEvent[] = [];
    textoEmergenciaBuscar = '';

    constructor(
        private navCtrl: NavController,
        private utilsService: UtilsService,
        private postsService: PostsService
    ) { }


    ngOnInit() {
    }

    async searchEmergencies(event) {
        const valor: string = event.detail.value;
        if (valor.length === 0) {
            this.searchingEmergencies = false;
            this.emergenciesBusqueda = [];
            return;
        }
        this.searchingEmergencies = true;
        this.emergenciesBusqueda = await this.emergencies.filter(emergency => {
            return emergency.title.toLowerCase().indexOf(valor.toLowerCase()) >= 0 || emergency.description.toLowerCase().indexOf(valor.toLowerCase()) >= 0;
        });
        if (this.emergenciesBusqueda.length === 0) {
            this.utilsService.showToast('No hay coincidencias');
        } else {
            this.utilsService.showToast(`Hay ${this.emergenciesBusqueda.length} coincidencias`);
        }
        this.searchingEmergencies = false;
        // this.postService.searchPosts(valor, environment.eventsSlug).pipe(
        //     finalize(() => {
        //         this.searchingEvents = false;
        //     })
        // ).subscribe((res: any) => {
        //     console.log('events search', res);
        //     this.eventsBusqueda = res.data;
        //     if (res.data.length === 0) {
        //         this.utilsService.showToast('No hay coincidencias');
        //     } else {
        //         this.utilsService.showToast(`Hay ${res.data.length} coincidencias`);
        //     }
        // }, err => {
        //         console.log('Ocurrio un error al buscar eventos', err);
        //         this.utilsService.showToast('Ocurrio un error al buscar eventos');
        // });
    }

    reportEmergency() {
        this.navCtrl.navigateForward('/emergency-create');
    }

    ionViewWillEnter() {
        this.utilsService.enableMenu();
        this.loadEmergencies();
    }

    ionViewWillLeave(){
        this.emergencies = [];
        this.postsService.resetEmergenciesPage();
    }

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
        this.navCtrl.navigateForward(`/emergency-detail/${id}`);
    }
    

    resetEmergencies() {
        this.emergencies = [];
        this.postsService.resetEmergenciesPage();
    }

}
