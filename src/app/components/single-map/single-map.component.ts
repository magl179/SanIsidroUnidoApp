import 'leaflet';
declare let L: any;
import { GestureHandling } from "leaflet-gesture-handling";
import { Component, OnInit, EventEmitter, Input, Output, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { LocalizationService } from "src/app/services/localization.service";
import { MapService } from "src/app/services/map.service";
import { manageTwoFingerDrag } from 'src/app/helpers/utils';
import { CONFIG } from 'src/config/config';
import { Map, LatLngBoundsExpression, Marker } from 'leaflet';

@Component({
    selector: 'single-map',
    templateUrl: './single-map.component.html',
    styleUrls: ['./single-map.component.scss'],
})
export class SingleMapComponent implements OnInit {

    @Input() id: string;
    @Input() className = '';
    @Input() zoomMap = 15;
    @Input() enableGesture = false;
    @Input() latitude: number;
    @Input() longitude: number;
    @Output() returnCoordinateChoosen = new EventEmitter();

    map: any;
    mapIsLoaded = false;
    @ViewChild("singleMap") mapDOM: ElementRef;

    constructor(
        private mapService: MapService
    ) { }

    async ngOnInit() {
        setTimeout(async () => {
            await this.initializeMap();
            if (this.enableGesture) {
                this.mapDOM.nativeElement.addEventListener("touchstart", manageTwoFingerDrag);
                this.mapDOM.nativeElement.addEventListener("touchend", manageTwoFingerDrag);
            }
        }, 1200);
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

        this.map.on('load', () => {
            L.control.scale().addTo(this.map);
            this.mapIsLoaded = true;
        });
        this.map.setView([this.latitude || -0.2188216, this.longitude || -78.5135489], this.zoomMap);

        L.tileLayer(CONFIG.MAPLAYERS.GOOGLE.URL, {
            attribution: CONFIG.MAPLAYERS.GOOGLE.ATRIBUTION,
            maxZoom: 18,
            updateWhenIdle: true,
            reuseTiles: true
        }).addTo(this.map);
        const icon = await this.mapService.getCustomIcon('red');

        const leafletLatLng: any = [this.latitude, this.longitude];
        let mainMarker: any;
        if (icon) {
            mainMarker = new L.Marker(leafletLatLng, {
                icon: icon, title: 'Mi Ubicación Actual',
                draggable: true
            });
        } else {
            mainMarker = new L.Marker(leafletLatLng, {
                title: 'Mi Ubicación Actual',
                draggable: true
            });
        }
        mainMarker.on('dragend', async (e: any) => {
            const position = await e.target.getLatLng();
            this.latitude = position.lat;
            this.longitude = position.lng;
            this.sendMarkerCoordinate();
        });
        mainMarker.bindPopup('Mi Ubicación').openPopup();
        this.map.addLayer(mainMarker);

        setTimeout(() => {
            this.map.fitBounds([leafletLatLng]);
        }, 1000);

        if (this.latitude && this.longitude) {
            this.sendMarkerCoordinate();
        }
    }

    // Cuando se lance el evento click en la plantilla llamaremos a este método
    async sendMarkerCoordinate() {
        this.returnCoordinateChoosen.emit({
            latitude: this.latitude,
            longitude: this.longitude,
        });
    }




}
