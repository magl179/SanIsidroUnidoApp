import { Component, OnInit } from '@angular/core';
import { UtilsService } from '../../../services/utils.service';

import { IUbicationItem } from 'src/app/interfaces/barrios';

@Component({
    selector: 'app-public-services',
    templateUrl: './public-services.page.html',
    styleUrls: ['./public-services.page.scss'],
})
export class PublicServicesPage implements OnInit {

    publicServicesPoints: IUbicationItem[] = [];
    filterPublicServices = [];
    isPublicServiceAvalaible = false;
    loading: any;

    constructor(
        private utilsService: UtilsService
    ) { }

    async ngOnInit() {
        // this.loading = await this.utilsService.createBasicLoading('Cargando Listado Servicios');
        // this.loading.present();
        setTimeout(async () => {
            this.publicServicesPoints = [
                { id: 1, title: 'San Jose de Moran', latitude: -0.0756493, longitude: -78.433859, iconColor: 'purple' },
                { id: 2, title: 'Terminal de Carcelen', latitude: -0.0999525, longitude: -78.4740685, iconColor: 'green' },
                { id: 3, title: 'Parque Bicentenario', latitude: -0.1384017, longitude: -78.4856772, iconColor: 'blue' },
                { id: 4, title: 'Plaza de Toros', latitude: -0.1548643, longitude: -78.4822049, iconColor: 'yellow' }];
            // this.loading.dismiss();
        }, 2000);
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

    disabledLoading(event) {
        // console.log({ datosHijoPS: event });
    }

}
