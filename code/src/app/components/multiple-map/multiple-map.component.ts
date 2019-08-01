import { Component, OnInit, Input, AfterViewInit, Output, EventEmitter } from '@angular/core';
import * as Leaflet from 'leaflet';
import * as LeafletSearch from 'leaflet-search';
import { GestureHandling } from 'leaflet-gesture-handling';
import { MapService } from 'src/app/services/map.service';
import { UtilsService } from '../../services/utils.service';
import { IUbicationItem } from 'src/app/interfaces/barrios';
import { LocalizationService } from '../../services/localization.service';

// const iconsColors = ['red', 'orange', 'yellow', 'purple'];
const tileURL = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const tileAtribution = '&copy; <a target=_blank" href="https://www.openstreetmap.org/copyright">© Colaboradores de OpenStreetMap</a>';

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
    mapLoading = null;
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
        this.mapLoading = await this.utilsService.createBasicLoading('Cargando Mapa');
        this.mapLoading.present();
        console.log('Multiple Map After View Init');
        this.mapMarkers = await this.mapService.getMarkers().toPromise();
        console.log('After get markers');
        this.currentCoordinate = await this.localizationService.getCoordinate();
        console.log('After get coordinate');
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
        // Verificar si se habilita el gesture handling
        console.log('Iniciar Mapa Múltiple');
        if (this.enableGesture) {
            Leaflet.Map.addInitHook('addHandler', 'gestureHandling', GestureHandling);
        }
        // Crear el Mapa
        this.map = Leaflet.map(this.idMap, {
            gestureHandling: this.enableGesture,
            fadeAnimation: false,
            zoomAnimation: false,
            markerZoomAnimation: false,
            zoomControl: false
        });

        // Agregar Evento On al Mapa
        this.map.on('load', (e) => {
            console.log('Map Loaded');
            this.mapIsLoaded = true;
            // Enviar informacion mapa al padre
            this.sendMapInfo();
            // apagar el loading
            this.mapLoading.dismiss();
        });
        // Configurar la vista centrada
        Leaflet.control.zoom({ position: 'topright' }).addTo(this.map);
        this.map.setView([-0.1548643, -78.4822049], this.zoomMap);
        // Agregar la capa del Mapa
        Leaflet.tileLayer(tileURL, {
            attribution: tileAtribution,
            maxZoom: 18,
            updateWhenIdle: true,
            reuseTiles: true
        }).addTo(this.map);

        // Añadir Polilinea al Mapa
        this.currentPolyline.addTo(this.map);
        // Añadir el control de escala
        Leaflet.control.scale({ position: 'bottomleft' }).addTo(this.map);
        // Si obtuve coordenadas añadir el marcador
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
        //
        await this.mapPoints.forEach(async point => {
            let punto = null;
            const markerIcon = await this.mapService.getCustomIcon('orange');
            if (markerIcon) {
                // tslint:disable-next-line: max-line-length
                punto = new Leaflet.Marker(new Leaflet.latLng([point.latitude, point.longitude]), { title: point.title, icon: markerIcon });
            } else {
                punto = new Leaflet.Marker(new Leaflet.latLng([point.latitude, point.longitude]), { title: point.title });
            }
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
            if (point.latitude === e.latlng.lat && point.longitude === e.latlng.lng) {
                selectedMarker = point;
            }
        });
        this.currentService = selectedMarker;
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

