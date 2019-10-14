import { Component, Input, AfterViewInit } from '@angular/core';
import * as Leaflet from 'leaflet';
import { GestureHandling } from 'leaflet-gesture-handling';
import { environment } from 'src/environments/environment';
import { IUbication } from "src/app/interfaces/models";
import { UtilsService } from "src/app/services/utils.service";
import { getJSON } from "src/app/helpers/utils";
import { MapService } from 'src/app/services/map.service';


@Component({
    selector: 'simple-map',
    templateUrl: './simple-map.component.html',
    styleUrls: ['./simple-map.component.scss'],
})
export class SimpleMapComponent implements AfterViewInit {

    @Input() idMap: string;
    @Input() zoom = 14;
    @Input() classMap = '';
    @Input() coordsMap: IUbication = {
        latitude: null,
        longitude: null,
        address: null,
        description: null
    };
    @Input() enableGesture = false;
    map: any;

    constructor(
        private utilsService: UtilsService,
        private mapService: MapService
    ) { }

    async ngAfterViewInit() {
        await this.initializeMap();
    }

    async initializeMap() {
        if (this.enableGesture) {
            Leaflet.Map.addInitHook('addHandler', 'gestureHandling', GestureHandling);
        }

        this.coordsMap = getJSON(this.coordsMap);

        this.map = Leaflet.map(this.idMap, {
            gestureHandling: this.enableGesture,
            fadeAnimation: false,
            zoomAnimation: false,
            markerZoomAnimation: false
        });
        this.map.on('load', (e) => {
            console.log('MAPA SIMPLE CARGADO');
            Leaflet.control.scale().addTo(this.map);
        });

        this.map.setView([this.coordsMap.latitude, this.coordsMap.longitude], this.zoom);
        Leaflet.tileLayer(environment.mapLayers.google.url, {
            attribution: environment.mapLayers.google.attribution,
            maxZoom: 18,
            updateWhenIdle: true,
            reuseTiles: true
        }).addTo(this.map);

        const icon = await this.mapService.getCustomIcon('red');
        const coordenadas = [this.coordsMap.latitude, this.coordsMap.longitude];
        let markerPosition;
           if (icon) {
                // tslint:disable-next-line: max-line-length
                markerPosition = new Leaflet.Marker(new Leaflet.latLng(coordenadas), { icon: icon});
            } else {
                // tslint:disable-next-line: max-line-length
                markerPosition = new Leaflet.Marker(new Leaflet.latLng(coordenadas));
            }
            markerPosition.addTo(this.map).bindPopup('Ubicación del Punto');
            //Leaflet.marker([this.coordsMap.latitude, this.coordsMap.longitude]).addTo(this.map);
    }

    onTwoFingerDrag(e) {
        if (e.type === 'touchstart' && e.touches.length === 1) {
            e.currentTarget.classList.add('swiping');
        } else {
            e.currentTarget.classList.remove('swiping');
        }
    }



}
