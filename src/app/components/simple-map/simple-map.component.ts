import 'leaflet';
import 'leaflet-routing-machine';
import { GestureHandling } from "leaflet-gesture-handling";
declare let L: any;
import { Component, Input, AfterViewInit, ElementRef, ViewChild } from "@angular/core";
import { environment } from 'src/environments/environment';
import { IUbication } from "src/app/interfaces/models";
import { getJSON } from "src/app/helpers/utils";
import { MapService } from 'src/app/services/map.service';
import { CONFIG } from 'src/config/config';


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
        latitude: null,
        longitude: null,
        address: null,
        description: null
    };
    @Input() enableGesture = false;
    map: any;
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
        this.map.on('load', (e: any) => {
            console.log('MAPA SIMPLE CARGADO');
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
        // const coordenadas: any[] = [this.coordsMap.latitude, this.coordsMap.longitude];
        let markerPosition: any;
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
