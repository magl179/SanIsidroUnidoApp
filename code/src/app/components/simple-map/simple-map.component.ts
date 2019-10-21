import { Component, Input, AfterViewInit, ElementRef, ViewChild } from "@angular/core";
import * as Leaflet from 'leaflet';
import { GestureHandling } from "leaflet-gesture-handling";
import { environment } from 'src/environments/environment';
import { IUbication } from "src/app/interfaces/models";
import { getJSON } from "src/app/helpers/utils";
import { MapService } from 'src/app/services/map.service';


@Component({
    selector: 'simple-map',
    templateUrl: './simple-map.component.html',
    styleUrls: ['./simple-map.component.scss'],
})
export class SimpleMapComponent implements AfterViewInit {

    @Input() idMap: string;
    @Input() zoom = 14;
    @Input() class = '';
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
            Leaflet.Map.addInitHook("addHandler", "gestureHandling", GestureHandling);
        }
        this.coordsMap = getJSON(this.coordsMap);
        console.log('enable gesture', this.enableGesture);
        this.map = Leaflet.map(this.idMap, {
            gestureHandling: this.enableGesture,
            fadeAnimation: false,
            zoomAnimation: false,
            markerZoomAnimation: false
        } as Leaflet.MapOptions);
        this.map.on('load', (e: any) => {
            console.log('MAPA SIMPLE CARGADO');
            Leaflet.control.scale().addTo(this.map);
        });

        this.map.setView([this.coordsMap.latitude, this.coordsMap.longitude], this.zoom);
        Leaflet.tileLayer(environment.mapLayers.google.url, {
            attribution: environment.mapLayers.google.attribution,
            maxZoom: 18,
            updateWhenIdle: true,
            reuseTiles: true
        } as Leaflet.TileLayerOptions).addTo(this.map);

        const icon = await this.mapService.getCustomIcon('red');
        // const coordenadas: any[] = [this.coordsMap.latitude, this.coordsMap.longitude];
        let markerPosition: any;
        const leafletLat = Leaflet.latLng(this.coordsMap.latitude, this.coordsMap.longitude);
        if (icon) {
            markerPosition = new Leaflet.Marker(leafletLat, { icon: icon });
        } else {
            markerPosition = new Leaflet.Marker(leafletLat);
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
