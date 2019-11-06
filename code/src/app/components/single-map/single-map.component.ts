import 'leaflet';
import 'leaflet-routing-machine';
import { GestureHandling } from "leaflet-gesture-handling";
declare let L: any;
import { Component, OnInit, EventEmitter, Input, Output, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { LocalizationService } from "src/app/services/localization.service";
import { environment } from "src/environments/environment";
import { manageTwoFingerDrag } from 'src/app/helpers/utils';

@Component({
    selector: 'single-map',
    templateUrl: './single-map.component.html',
    styleUrls: ['./single-map.component.scss'],
})
export class SingleMapComponent implements OnInit, AfterViewInit {

    @Input() id: string;
    @Input() className = '';
    @Input() zoomMap = 15;
    @Input() enableGesture = false;
    @Output() returnCoordinateChoosen = new EventEmitter();

    map: any;
    mapIsLoaded = false;
    currentCoordinate: any = {
        latitude: null,
        longitude: null,
        address: null
    };
    @ViewChild("singleMap") mapDOM: ElementRef;

    constructor(
        private localizationService: LocalizationService
    ) { }

    async ngOnInit() { }

    async ngAfterViewInit() {
        this.currentCoordinate = await this.localizationService.getCoordinate();
        if (this.currentCoordinate) {
            this.sendMarkerCoordinate();
        }
        await this.initializeMap();
        if (this.enableGesture) {     
            this.mapDOM.nativeElement.addEventListener("touchstart", manageTwoFingerDrag);
            this.mapDOM.nativeElement.addEventListener("touchend", manageTwoFingerDrag);
        }
    }

    async initializeMap() {
        if (this.enableGesture) {
            L.Map.addInitHook("addHandler", "gestureHandling", GestureHandling);
        }
        this.map = L.map(this.id, {
            gestureHandling: this.enableGesture,
            fadeAnimation: false,
            zoomAnimation: false,
            markerZoomAnimation: false
        });

        await this.map.on('load', (e) => {
            console.log('MAPA SINGLE CARGADO');
            L.control.scale().addTo(this.map);
            this.mapIsLoaded = true;
        });
        this.map.setView([this.currentCoordinate.latitude || -0.2188216, this.currentCoordinate.longitude || -78.5135489], this.zoomMap);

        L.tileLayer(environment.mapLayers.google.url, {
            attribution: environment.mapLayers.google.attribution,
            maxZoom: 18,
            updateWhenIdle: true,
            reuseTiles: true
        }).addTo(this.map);

        const mainMarker = L.marker([this.currentCoordinate.latitude || -0.2188216, this.currentCoordinate.longitude || -78.5135489], {
            title: 'Mi Ubicación Actual',
            draggable: true
        });
        mainMarker.on('dragend', async (e) => {
            const position = await e.target.getLatLng();
            this.currentCoordinate.latitude = position.lat;
            this.currentCoordinate.longitude = position.lng;
            this.sendMarkerCoordinate();
        });
        mainMarker.bindPopup('Mi Ubicación').openPopup();

        this.map.addLayer(mainMarker);
    }

    // Cuando se lance el evento click en la plantilla llamaremos a este método
    async sendMarkerCoordinate() {
        await this.returnCoordinateChoosen.emit({
            latitude: this.currentCoordinate.latitude,
            longitude: this.currentCoordinate.longitude,
        });
    }




}
