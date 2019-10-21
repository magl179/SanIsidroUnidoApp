import { Component, OnInit, EventEmitter, Input, Output, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import * as Leaflet from 'leaflet';
import { LocalizationService } from "src/app/services/localization.service";
import { environment } from "src/environments/environment";
import { manageTwoFingerDrag } from 'src/app/helpers/utils';
import { GestureHandling } from "leaflet-gesture-handling";

@Component({
    selector: 'single-map',
    templateUrl: './single-map.component.html',
    styleUrls: ['./single-map.component.scss'],
})
export class SingleMapComponent implements OnInit, AfterViewInit {

    @Input() idMap: string;
    @Input() class = '';
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
            Leaflet.Map.addInitHook("addHandler", "gestureHandling", GestureHandling);
        }
        this.map = Leaflet.map(this.idMap, {
            gestureHandling: this.enableGesture,
            fadeAnimation: false,
            zoomAnimation: false,
            markerZoomAnimation: false
        } as Leaflet.MapOptions);

        await this.map.on('load', (e) => {
            console.log('MAPA SINGLE CARGADO');
            Leaflet.control.scale().addTo(this.map);
            this.mapIsLoaded = true;
        });
        this.map.setView([this.currentCoordinate.latitude || -0.2188216, this.currentCoordinate.longitude || -78.5135489], this.zoomMap);

        Leaflet.tileLayer(environment.mapLayers.google.url, {
            attribution: environment.mapLayers.google.attribution,
            maxZoom: 18,
            updateWhenIdle: true,
            reuseTiles: true
        } as Leaflet.LayerOptions).addTo(this.map);

        const mainMarker = Leaflet.marker([this.currentCoordinate.latitude || -0.2188216, this.currentCoordinate.longitude || -78.5135489], {
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
