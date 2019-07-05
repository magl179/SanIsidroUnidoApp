import { Component, OnInit } from '@angular/core';
import { UtilsService } from '../../../services/utils.service';

import { UbicationItem } from 'src/app/interfaces/barrios';

@Component({
    selector: 'app-public-services',
    templateUrl: './public-services.page.html',
    styleUrls: ['./public-services.page.scss'],
})
export class PublicServicesPage implements OnInit {

    publicServicesPoints: UbicationItem[] = [];
    loading: any;

    constructor(
        private utilsService: UtilsService
    ) { }

    async ngOnInit() {
        this.loading = await this.utilsService.createBasicLoading('Cargando Problemas');
        this.loading.present();
        console.log({ ddd: this.loading });
        setTimeout(async () => {
            this.publicServicesPoints = [
                { title: 'San Jose de Moran', latitude: -0.0756493, longitude: -78.433859, iconColor: 'purple' },
                { title: '<strong>Terminal de Carcelen</strong>', latitude: -0.0999525, longitude: -78.4740685, iconColor: 'green' },
                { title: 'Parque Bicentenario', latitude: -0.1384017, longitude: -78.4856772, iconColor: 'blue' },
                { title: 'Plaza de Toros', latitude: -0.1548643, longitude: -78.4822049, iconColor: 'yellow' }];
            console.log({ dd: this.loading });
            this.loading.dismiss();
        }, 2000);
    }

    desactivarLoading(event) {
        console.log({ datosHijoPS: event });
    }

}
