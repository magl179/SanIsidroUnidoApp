import { Component, OnInit, EventEmitter, Input, Output, AfterViewInit } from '@angular/core';
import * as Leaflet from 'leaflet';
import { GestureHandling } from 'leaflet-gesture-handling';
import { IPostUbicationItem } from 'src/app/interfaces/barrios';

const tileURL = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const tileAtribution = '&copy; <a target=_blank" href="https://www.openstreetmap.org/copyright">© Colaboradores de OpenStreetMap</a>';

@Component({
    selector: 'single-map',
    templateUrl: './single-map.component.html',
    styleUrls: ['./single-map.component.scss'],
})
export class SingleMapComponent implements OnInit, AfterViewInit {

    @Input() idMap: string;
    @Input() zoomMap: number;
    @Input() mapPoints: IPostUbicationItem;
    @Input() enableGesture = false;
    @Output() returnCoordinateChoosen = new EventEmitter();

    map: any;
    mapIsLoaded = false;

    constructor() { }

    async ngOnInit() { }

    async ngAfterViewInit() {
        await this.initializeMap();
    }

    onTwoFingerDrag(e) {
        if (e.type === 'touchstart' && e.touches.length === 1) {
            e.currentTarget.classList.add('swiping');
        } else {
            e.currentTarget.classList.remove('swiping');
        }
    }

    async initializeMap() {
        if (this.enableGesture) {
            Leaflet.Map.addInitHook('addHandler', 'gestureHandling', GestureHandling);
        }
        this.map = await Leaflet.map(this.idMap, {
            gestureHandling: this.enableGesture,
            fadeAnimation: false,
            zoomAnimation: false,
            markerZoomAnimation: false
        });

        await this.map.on('load', (e) => {
            console.log('MAPA SINGLE CARGADO');
            Leaflet.control.scale().addTo(this.map);
            this.mapIsLoaded = true;
        });
        this.map.setView([this.mapPoints.latitude || -0.2188216, this.mapPoints.longitude || -78.5135489], this.zoomMap || 15);

        Leaflet.tileLayer(tileURL, {
            attribution: tileAtribution,
            maxZoom: 18,
            updateWhenIdle: true,
            reuseTiles: true
        }).addTo(this.map);

        const mainMarker = await Leaflet.marker([this.mapPoints.latitude || -0.2188216, this.mapPoints.longitude || -78.5135489], {
            title: this.mapPoints.address || 'No hay direccion',
            draggable: true
        });
        mainMarker.on('dragend', async (e) => {
            const position = await e.target.getLatLng();
            this.mapPoints.latitude = position.lat;
            this.mapPoints.longitude = position.lng;
            this.sendMarkerCoordinate();
        });
        this.map.addLayer(mainMarker);
    }

    // Cuando se lance el evento click en la plantilla llamaremos a este método
    async sendMarkerCoordinate() {
        await this.returnCoordinateChoosen.emit({
            lat: this.mapPoints.latitude,
            lng: this.mapPoints.longitude
        });
    }




}
