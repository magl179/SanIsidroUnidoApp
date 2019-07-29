import { Component, OnInit, Input, AfterViewInit, Output, EventEmitter } from '@angular/core';
import * as Leaflet from 'leaflet';
import * as LeafletSearch from 'leaflet-search';
import { GestureHandling } from 'leaflet-gesture-handling';
import { MapService } from 'src/app/services/map.service';
import { UtilsService } from '../../services/utils.service';

import { IUbicationItem } from 'src/app/interfaces/barrios';
import { LocalizationService } from '../../services/localization.service';

const shadowIcon = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png';
const iconsColors = ['red', 'orange', 'yellow', 'purple'];

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
    markersLayer = new Leaflet.LayerGroup();
    currentUserLayer = new Leaflet.LayerGroup();
    currentPolyline = Leaflet.polyline([[1, 2], [3, 4]], {
        color: '#ff8181'
    });
    currentService = null;
    currentCoordinate = null;
    latlngsOrigDest = [
        [-0.0756493, -78.433859],
        [-0.0999525, -78.4740685]
    ];

    strictBounds = new Leaflet.latLngBounds(
        new Leaflet.latLng(-0.27950918164172833, -78.56206247545173),
        new Leaflet.latLng(-0.06358925013978478, -78.42609322912877)
    );

    constructor(
        private mapService: MapService,
        private utilsService: UtilsService,
        private localizationService: LocalizationService
    ) { }

    async ngOnInit() { }

    async ngAfterViewInit() {
        this.mapMarkers = await this.mapService.getMarkers().toPromise();
        this.currentCoordinate = await this.localizationService.getCoordinate();
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
            this.mapIsLoaded = true;
            this.sendMapInfo();
            // this.preventMoveOutLimits();
        });

        this.map.setView([-0.1548643, -78.4822049], this.zoomMap);
        Leaflet.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: 'www.tphangout.com',
            maxZoom: 18,
            updateWhenIdle: true,
            reuseTiles: true
        }).addTo(this.map);



        this.currentPolyline.addTo(this.map);
        Leaflet.control.scale().addTo(this.map);

        if (this.currentCoordinate !== null) {
            // tslint:disable-next-line: max-line-length
            const iconCurrent = await this.mapService.getCustomIcon('blue');
            let currentPoint;
            if (iconCurrent) {
                // tslint:disable-next-line: max-line-length
                currentPoint = new Leaflet.Marker(new Leaflet.latLng([this.currentCoordinate.latitude, this.currentCoordinate.longitude]), { icon: iconCurrent, title: 'Mi Posición Actual' });
                // console.log('customed icon current marker');
            } else {
                // tslint:disable-next-line: max-line-length
                currentPoint = new Leaflet.Marker(new Leaflet.latLng([this.currentCoordinate.latitude, this.currentCoordinate.longitude]), { title: 'Mi Posición Actual' });
                // console.log('no customed icon current marker');
            }
            currentPoint.addTo(this.map).bindPopup('Tu estas aqúi').openPopup();
            // this.markersLayer.addLayer(currentPoint);
        }
        console.log('map points', this.mapPoints);
        await this.mapPoints.forEach(async point => {
            // const indice = Math.floor(Math.random() * (iconsColors.length));
            // const iconColor = iconsColors[indice];
            let punto = null;
            // console.log(indice);
            const markerIcon = await this.mapService.getCustomIcon('orange');
            if (markerIcon) {
                // tslint:disable-next-line: max-line-length
                punto = new Leaflet.Marker(new Leaflet.latLng([point.latitude, point.longitude]), { title: point.title, icon: markerIcon });
            } else {
                punto = new Leaflet.Marker(new Leaflet.latLng([point.latitude, point.longitude]), { title: point.title });
            }
            // const punto = new Leaflet.Marker(new Leaflet.latLng([point.latitude, point.longitude]), { title: point.title });
            punto.on('click', (e) => { this.showInfo(e); });
            punto.bindPopup(point.description);
            this.markersLayer.addLayer(punto);
        });




        const searchControl = new LeafletSearch({
            position: 'topleft',
            layer: this.markersLayer,
            initial: false,
            textPlaceholder: 'Buscar...',
            autoCollapse: true,
            autoCollapseTime: 2000,
            // marker: false,
            moveToLocation: (latlng, title, map) => {
                console.log(latlng);
                console.log(title);
                console.log(map);

                this.map.setView(latlng, 13);
                if (this.currentCoordinate !== null) {
                    this.latlngsOrigDest[0] = [this.currentCoordinate.latitude, this.currentCoordinate.longitude];
                    this.latlngsOrigDest[1] = [latlng.lat, latlng.lng];
                    console.log('tatlng: ', this.latlngsOrigDest);
                    this.currentPolyline.setLatLngs(this.latlngsOrigDest);
                    this.currentPolyline.redraw();
                    // map.addLayer(lineRoute);
                }
            }
        });
        this.map.addLayer(this.markersLayer);

        // this.map.addLayer(this.currentUserLayer);



        this.map.addControl(searchControl);
        searchControl.on('search:collapsed', (e) => {
            console.log(e);
            // this.map.setView([51.101516, 10.313446], 6);
        });
    }

    async sendMapInfo() {
        await this.returnMapLoaded.emit({
            mapisLoad: this.mapIsLoaded,
            serviceSelected: this.currentService
        });
    }

    showInfo(e) {
        let selectedMarker = null;
        console.log(e);
        console.log(this.mapPoints);
        this.mapPoints.forEach((point) => {
            // return point.latitude === e.latlng.lat && point.longitude === e.latlng.lng;
            if (point.latitude === e.latlng.lat && point.longitude === e.latlng.lng) {
                selectedMarker = point;
            }
        });
        this.currentService = selectedMarker;
        this.sendMapInfo();
    }

    preventMoveOutLimits() {
        this.map.on('moveend', () => {
            // code stuff
            if (this.strictBounds.contains(this.map.getCenter())) {
                return;
            }
            // We're out of bounds - Move the map back within the bounds
            const c = this.map.getCenter();
            console.log('ccc', c);
            let x = c.lng;
            let y = c.lat;
            const maxX = this.strictBounds.getNorthEast().lng;
            const maxY = this.strictBounds.getNorthEast().lat;
            const minX = this.strictBounds.getSouthWest().lng;
            const minY = this.strictBounds.getSouthWest().lat;

            if (x < minX) { x = minX; }
            if (x > maxX) { x = maxX; }
            if (y < minY) { y = minY; }
            if (y > maxY) { y = maxY; }

            setTimeout(() => {
                this.map.panTo(new Leaflet.latLng(y, x));
            }, 1000);
        });
    }

}

