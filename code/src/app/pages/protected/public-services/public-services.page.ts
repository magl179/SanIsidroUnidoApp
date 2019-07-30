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
    publicServiceSelected = null;
    loading: any;

    constructor(
        private utilsService: UtilsService
    ) { }

    async ngOnInit() {
        this.publicServicesPoints = [
            {
                id: 1, title: 'Centro de Salud Equidad', latitude: -0.0756493, longitude: -78.433859,
                description: '<h1>Centro de Salud Equidad</h1><p>Carlos Mantilla y de las viñas</p><p>2054784</p>'
            },
            {
                id: 2, title: 'Terminal de Carcelen', latitude: -0.0999525, longitude: -78.4740685,
                description: '<h1>Terminal de Carcelen</h1><p>Av Galo Plaza Lasso y Eloy Alfaro</p><p>2054784</p>'
            },
            {
                id: 3, title: 'Parque Bicentenario', latitude: -0.1384017, longitude: -78.4856772,
                description: '<h1>Parque Bicentenario</h1><p>Av 10 de Agosto y Amazonas</p><p>2054784</p>'
            },
            {
                id: 4, title: 'Plaza de Toros', latitude: -0.1548643, longitude: -78.4822049,
                description: '<h1>Plaza de Toros</h1><p>Av 10 de Agosto y Amazonas</p><p>2054784</p>'
            }
        ];
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
