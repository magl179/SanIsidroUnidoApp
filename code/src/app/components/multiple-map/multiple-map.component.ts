import { Component, OnInit, Input, AfterViewInit, Output, EventEmitter } from '@angular/core';
import * as Leaflet from 'leaflet';
import { GestureHandling } from 'leaflet-gesture-handling';
import { MapService } from 'src/app/services/map.service';
import { UtilsService } from '../../services/utils.service';

import { IUbicationItem } from 'src/app/interfaces/barrios';

const shadowIcon = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png';

@Component({
    selector: 'multiple-map',
    templateUrl: './multiple-map.component.html',
    styleUrls: ['./multiple-map.component.scss'],
})
export class MultipleMapComponent implements OnInit, AfterViewInit {

    @Input() idMap: string;
    @Input() zoomMap: number;
    @Input() mapPoints: IUbicationItem[] = [];
    @Input() enableGesture = false;
    @Output() returnMapLoaded = new EventEmitter();

    map: any;
    mapMarkers: any[] = null;
    mapIsLoaded = false;

    constructor(
        private mapService: MapService
    ) { }

    async ngOnInit() { }

    async ngAfterViewInit() {
        this.mapMarkers = await this.mapService.getMarkers().toPromise();
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
        this.map = Leaflet.map(this.idMap, {
            gestureHandling: this.enableGesture,
            fadeAnimation: false,
            zoomAnimation: false,
            markerZoomAnimation: false
        });
        this.map.on('load', (e) => {
            Leaflet.control.scale().addTo(this.map);
            this.mapPoints.forEach(async (marcador) => {
                const punto = await this.mapService.createMarker(this.mapMarkers, marcador);
                punto.bindPopup(marcador.title)
                    .addTo(this.map);
            });
            this.mapIsLoaded = true;
            this.sendMapLoaded();
        });
        this.map.setView([-0.1548643, -78.4822049], this.zoomMap);
        Leaflet.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: 'www.tphangout.com',
            maxZoom: 18,
            updateWhenIdle: true,
            reuseTiles: true
        }).addTo(this.map);
    }

    async sendMapLoaded() {
        await this.returnMapLoaded.emit({
            mapisLoad: this.mapIsLoaded
        });
    }

}

