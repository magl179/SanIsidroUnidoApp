import { Component, OnInit, Input} from '@angular/core';
import { IPublicService } from "src/app/interfaces/models";
import { ModalController } from '@ionic/angular';
import { getDistanceInKm, roundDecimal } from 'src/app/helpers/utils';

@Component({
  selector: 'app-map-info',
  templateUrl: './map-info.page.html',
  styleUrls: ['./map-info.page.scss'],
})
export class MapInfoPage implements OnInit {

    @Input() mapPoint: IPublicService;
    @Input() currentLocation: { latitude: number
    longitude: number, route?: any};

    distancia = null;

    constructor(
        private modalCtrl: ModalController
    ) { 
        
  }

    ngOnInit() { 
        const mapUbication = this.mapPoint.ubication;
        this.distancia = (this.mapPoint && this.currentLocation) ? roundDecimal(getDistanceInKm(mapUbication.latitude, mapUbication.longitude, this.currentLocation.latitude, this.currentLocation.longitude)) : null;
    }
    
    closeMapInfoModa() {
        this.modalCtrl.dismiss({
            nombre: 'Ana',
            pais: 'España'
        });
    }

    getKilometers(meters) {
        return Math.round(meters / 1000);
    }
    getMinutes(seconds) {
        return Math.round(seconds / 60);
    }

}
