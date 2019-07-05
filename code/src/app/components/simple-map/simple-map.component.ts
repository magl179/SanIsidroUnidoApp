import { Component, Input, AfterViewInit } from '@angular/core';
import * as Leaflet from 'leaflet';
import { GestureHandling } from 'leaflet-gesture-handling';
import { SimpleUbicationItem } from 'src/app/interfaces/barrios';

@Component({
    selector: 'simple-map',
    templateUrl: './simple-map.component.html',
    styleUrls: ['./simple-map.component.scss'],
})
export class SimpleMapComponent implements AfterViewInit {

    @Input() idMapa: string;
    @Input() claseMapa: string;
    // @Input() markerText: string;
    @Input() coordsMap: SimpleUbicationItem = {
        latitude: null,
        longitude: null,
        title: null
    };
    @Input() enableGesture = false;
    mapa: any;
    mapsList: any[];

    constructor() { }

    async ngAfterViewInit() {
        await this.iniciarMapa();
    }

    async iniciarMapa() {
        if (this.enableGesture) {
            Leaflet.Map.addInitHook('addHandler', 'gestureHandling', GestureHandling);
        }
        this.mapa = Leaflet.map(this.idMapa, {
            gestureHandling: this.enableGesture,
            fadeAnimation: false,
            zoomAnimation: false,
            markerZoomAnimation: false
        });
        this.mapa.on('load', (e) => {
            console.log('MAPA SIMPLE CARGADO');
            Leaflet.control.scale().addTo(this.mapa);
        });

        this.mapa.setView([this.coordsMap.latitude, this.coordsMap.longitude], 12);
        Leaflet.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: 'www.tphangout.com',
            maxZoom: 18,
            updateWhenIdle: true,
            reuseTiles: true
        }).addTo(this.mapa);

        Leaflet.marker([this.coordsMap.latitude, this.coordsMap.longitude]).addTo(this.mapa)
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
