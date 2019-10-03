import { Component, Input, AfterViewInit } from '@angular/core';
import * as Leaflet from 'leaflet';
import { GestureHandling } from 'leaflet-gesture-handling';
import { environment } from 'src/environments/environment';
import { IUbication } from "src/app/interfaces/models";
import { UtilsService } from "src/app/services/utils.service";
import { getJSON } from "src/app/helpers/utils";

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
        private utilsService: UtilsService
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
        console.log('Map coords', this.coordsMap);
        this.map.on('load', (e) => {
            console.log('MAPA SIMPLE CARGADO');
            Leaflet.control.scale().addTo(this.map);
        });

        this.map.setView([this.coordsMap.latitude, this.coordsMap.longitude], this.zoom);
        Leaflet.tileLayer(environment.googleMapLayer.url, {
            attribution: environment.googleMapLayer.attribution,
            maxZoom: 18,
            updateWhenIdle: true,
            reuseTiles: true
        }).addTo(this.map);

        Leaflet.marker([this.coordsMap.latitude, this.coordsMap.longitude]).addTo(this.map);
    }

    onTwoFingerDrag(e) {
        if (e.type === 'touchstart' && e.touches.length === 1) {
            e.currentTarget.classList.add('swiping');
        } else {
            e.currentTarget.classList.remove('swiping');
        }
    }



}
