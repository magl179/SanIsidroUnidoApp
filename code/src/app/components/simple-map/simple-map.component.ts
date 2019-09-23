import { Component, Input, AfterViewInit } from '@angular/core';
import * as Leaflet from 'leaflet';
import { GestureHandling } from 'leaflet-gesture-handling';
import { ISimpleUbicationItem } from 'src/app/interfaces/barrios';
import { environment } from 'src/environments/environment';
import { IUbication } from "../../interfaces/models";
import { UtilsService } from "../../services/utils.service";

const tileURL = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const tileAtribution = '&copy; <a target=_blank" href="https://www.openstreetmap.org/copyright">© Colaboradores de OpenStreetMap</a>';

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

        this.coordsMap = this.utilsService.getJSON(this.coordsMap);

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
