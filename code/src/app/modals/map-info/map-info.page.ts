import { Component, OnInit, Input} from '@angular/core';
import { IPublicService } from "src/app/interfaces/models";
import { ModalController } from '@ionic/angular';
import { MapService } from "src/app/services/map.service";

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
        private modalCtrl: ModalController,
        private mapService: MapService
    ) { 
        
  }

    ngOnInit() { 
        console.log('map_point_info', this.mapPoint);
        console.log('currentUbication', this.currentLocation);
        const mapUbication = this.mapPoint.ubication;
        // const distancia = const distancia2Round = Math.round(distancia2 * 100) / 100;
        this.distancia = (this.mapPoint && this.currentLocation) ? this.roundDecimal(this.mapService.getDistanceInKm(mapUbication.latitude, mapUbication.longitude, this.currentLocation.latitude, this.currentLocation.longitude)) : null;
    }

    roundDecimal(number) {
        return Math.round(number * 100) / 100;
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
