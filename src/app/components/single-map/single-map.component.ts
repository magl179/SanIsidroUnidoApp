import 'leaflet';
import 'leaflet-routing-machine';
declare let L: any;
import { GestureHandling } from "leaflet-gesture-handling";
import { Component, OnInit, EventEmitter, Input, Output, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { LocalizationService } from "src/app/services/localization.service";
import { MapService } from "src/app/services/map.service";
// import { environment } from "src/environments/environment";
import { manageTwoFingerDrag } from 'src/app/helpers/utils';
import { CONFIG } from 'src/config/config';

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
    @Input() latitude: any;
    @Input() longitude: any;
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
        private localizationService: LocalizationService,
        private mapService: MapService
    ) { }

    async ngOnInit() { }

    async ngAfterViewInit() {
        // this.currentCoordinate = await this.localizationService.getCoordinates();
        this.currentCoordinate.latitude = this.latitude;
        this.currentCoordinate.longitude = this.longitude;
        console.log('inputs coordinates', this.currentCoordinate)
        
        console.log('single map current coordinates despues')
        if (this.latitude && this.longitude) {
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
            markerZoomAnimation: true
        });

        await this.map.on('load', (e: any) => {
            L.control.scale().addTo(this.map);
            this.mapIsLoaded = true;
            console.log('mapa single map cargado')
        });
        this.map.setView([this.latitude || -0.2188216, this.longitude || -78.5135489], this.zoomMap);

        L.tileLayer(CONFIG.MAPLAYERS.GOOGLE.URL, {
            attribution: CONFIG.MAPLAYERS.GOOGLE.ATRIBUTION,
            maxZoom: 18,
            updateWhenIdle: true,
            reuseTiles: true
        }).addTo(this.map);

        // this.currentCoordinate.longitude = this.longitude;
        const icon = await this.mapService.getCustomIcon('red');
        const leafletLat = [this.currentCoordinate.latitude || -0.2188216, this.currentCoordinate.longitude || -78.5135489];
        let mainMarker: any;
        if (icon) {
            mainMarker = new L.Marker(leafletLat, { icon: icon, title: 'Mi Ubicación Actual',
            draggable: true});
        } else {
            mainMarker = new L.Marker(leafletLat, {title: 'Mi Ubicación Actual',
            draggable: true});
        }
        // const mainMarker = L.marker([this.currentCoordinate.latitude || -0.2188216, this.currentCoordinate.longitude || -78.5135489], {
        //     title: 'Mi Ubicación Actual',
        //     draggable: true
        // });
        mainMarker.on('dragend', async (e: any) => {
            const position = await e.target.getLatLng();
            this.currentCoordinate.latitude = position.lat;
            this.currentCoordinate.longitude = position.lng;
            this.sendMarkerCoordinate();
        });
        mainMarker.bindPopup('Mi Ubicación').openPopup();

        this.map.addLayer(mainMarker);
        console.log('agregado capa marcador single map')
    }

    // Cuando se lance el evento click en la plantilla llamaremos a este método
    async sendMarkerCoordinate() {
        this.returnCoordinateChoosen.emit({
            latitude: this.currentCoordinate.latitude,
            longitude: this.currentCoordinate.longitude,
        });
    }




}
