import { Component, OnInit } from '@angular/core';
import { UtilsService } from '../../../services/utils.service';
import { IUbicationItem } from 'src/app/interfaces/barrios';
import { IPublicService } from 'src/app/interfaces/models';
import { PostsService } from '../../../services/posts.service';

// import { environment}

@Component({
    selector: 'app-public-services',
    templateUrl: './public-services.page.html',
    styleUrls: ['./public-services.page.scss'],
})
export class PublicServicesPage implements OnInit {

    publicServicesPoints: IUbicationItem[] = [];
    publicServices: IPublicService[] = [];
    filterPublicServices = [];
    isPublicServiceAvalaible = false;
    publicServiceSelected = null;
    loading: any;

    constructor(
        private utilsService: UtilsService,
        private postService: PostsService
    ) { }

    async ngOnInit() {
        this.postService.getPublicServices().subscribe(response => {
            this.publicServices = response.data;
        });
    }

    searchPublicServices(event) {
        // Initialize Public Services Data
        this.filterPublicServices = this.publicServicesPoints;
        const val = event.target.value;
        // if the value is an empty string don't filter the items
        if (val && val.trim() !== '') {
            this.isPublicServiceAvalaible = true;
            this.filterPublicServices = this.publicServicesPoints.filter((item) => {
                return (item.title.toLowerCase().indexOf(val.toLowerCase()) > -1);
            });
        }
    }

    async showPublicService(indice) {
        console.log('Mostrar Servicio Público con el ID: ', indice);
        await this.utilsService.showToast(`Mostrar Servicio Público con el ID: ${indice}`);
    }

    manageDataMap(event) {
        console.log({ datosHijoPS: event });
        if (event.serviceSelected) {
            this.publicServiceSelected = event.serviceSelected;
        }
    }

}
