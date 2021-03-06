import 'leaflet';
import { GestureHandling } from "leaflet-gesture-handling";
declare let L: any;
import { Component, Input, AfterViewInit, ElementRef, ViewChild } from "@angular/core";
import { IUbication } from "src/app/interfaces/models";
import { getJSON } from "src/app/helpers/utils";
import { MapService } from 'src/app/services/map.service';
import { CONFIG } from 'src/config/config';
import { Marker } from 'leaflet';


@Component({
    selector: 'simple-map',
    templateUrl: './simple-map.component.html',
    styleUrls: ['./simple-map.component.scss'],
})
export class SimpleMapComponent implements AfterViewInit {

    @Input() id: string;
    @Input() zoom = 14;
    @Input() className = '';
    @Input() coordsMap: IUbication = {
        latitude: CONFIG.DEFAULT_LOCATION.latitude,
        longitude: CONFIG.DEFAULT_LOCATION.longitude,
        address: CONFIG.DEFAULT_LOCATION.address,
        description: CONFIG.DEFAULT_LOCATION.description
    };
    @Input() enableGesture = false;
    map;
    @ViewChild("simpleMap") mapDOM: ElementRef;

    constructor(
        private mapService: MapService
    ) { }

    async ngAfterViewInit() {
        await this.initializeMap();
    }

    async initializeMap() {
        if (this.enableGesture) {
            L.Map.addInitHook("addHandler", "gestureHandling", GestureHandling);
        }

        this.coordsMap = getJSON(this.coordsMap);
        this.map = L.map(this.id, {
            gestureHandling: this.enableGesture,
            fadeAnimation: false,
            zoomAnimation: false,
            markerZoomAnimation: false
        });
        this.map.on('load', () => {
            L.control.scale().addTo(this.map);
        });

        this.map.setView([this.coordsMap.latitude, this.coordsMap.longitude], this.zoom);
        L.tileLayer(CONFIG.MAPLAYERS.GOOGLE.URL, {
            attribution: CONFIG.MAPLAYERS.GOOGLE.ATRIBUTION,
            maxZoom: 18,
            updateWhenIdle: true,
            reuseTiles: true
        }).addTo(this.map);


        const icon = await this.mapService.getCustomIcon('red');
        let markerPosition: Marker;
        const leafletLat = L.latLng(this.coordsMap.latitude, this.coordsMap.longitude);
        if (icon) {
            markerPosition = new L.Marker(leafletLat, { icon: icon });
        } else {
            markerPosition = new L.Marker(leafletLat);
        }
        markerPosition.addTo(this.map).bindPopup('Ubicación del Punto');

    }

    onTwoFingerDrag(e) {
        if (e.type === 'touchstart' && e.touches.length === 1) {
            e.currentTarget.classList.add('swiping');
        } else {
            e.currentTarget.classList.remove('swiping');
        }
    }



}
