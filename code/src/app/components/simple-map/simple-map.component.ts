import { Component, Input, AfterViewInit } from '@angular/core';
import * as Leaflet from 'leaflet';
import { GestureHandling } from 'leaflet-gesture-handling';
import { ISimpleUbicationItem } from 'src/app/interfaces/barrios';

const tileURL = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const tileAtribution = '&copy; <a target=_blank" href="https://www.openstreetmap.org/copyright">© Colaboradores de OpenStreetMap</a>';

@Component({
    selector: 'simple-map',
    templateUrl: './simple-map.component.html',
    styleUrls: ['./simple-map.component.scss'],
})
export class SimpleMapComponent implements AfterViewInit {

    @Input() idMap: string;
    @Input() classMap = '';
    @Input() coordsMap: ISimpleUbicationItem = {
        latitude: null,
        longitude: null,
        title: null
    };
    @Input() enableGesture = false;
    map: any;

    constructor() { }

    async ngAfterViewInit() {
        await this.initializeMap();
    }

    async initializeMap() {
        if (this.enableGesture) {
            Leaflet.Map.addInitHook('addHandler', 'gestureHandling', GestureHandling);
        }
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

        this.map.setView([this.coordsMap.latitude, this.coordsMap.longitude], 13);
        Leaflet.tileLayer(tileURL, {
            attribution: tileAtribution,
            maxZoom: 18,
            updateWhenIdle: true,
            reuseTiles: true
        }).addTo(this.map);

        Leaflet.marker([this.coordsMap.latitude, this.coordsMap.longitude]).addTo(this.map)
            .bindPopup(this.coordsMap.title);
    }

    onTwoFingerDrag(e) {
        if (e.type === 'touchstart' && e.touches.length === 1) {
            e.currentTarget.classList.add('swiping');
        } else {
            e.currentTarget.classList.remove('swiping');
        }
    }



}
