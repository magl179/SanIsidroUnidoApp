import { Component, OnInit, Input, AfterViewInit, Output, EventEmitter } from '@angular/core';
import * as Leaflet from 'leaflet';
import * as LeafletSearch from 'leaflet-search';
import { GestureHandling } from 'leaflet-gesture-handling';
import { MapService } from 'src/app/services/map.service';
import { UtilsService } from '../../services/utils.service';
import { IPublicService } from 'src/app/interfaces/models';
import { LocalizationService } from '../../services/localization.service';
import { environment } from "../../../environments/environment";

// const iconsColors = ['red', 'orange', 'yellow', 'purple'];
const tileURL = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const tileAtribution = '&copy; <a target=_blank" href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

@Component({
    selector: 'multiple-map',
    templateUrl: './multiple-map.component.html',
    styleUrls: ['./multiple-map.component.scss'],
})
export class MultipleMapComponent implements OnInit, AfterViewInit {

    @Input() idMap: string;
    @Input() zoomMap: number = 16;
    @Input() mapPoints: IPublicService[] = [];
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
    markerSelected = false;
    currentService = null;
    currentCoordinate = null;
    latlngsOrigDest = [
        [-0.0756493, -78.433859],
        [-0.0999525, -78.4740685]
    ];
    mapLoading = null;
    // strictBounds = new Leaflet.latLngBounds(
    //     new Leaflet.latLng(-0.27950918164172833, -78.56206247545173),
    //     new Leaflet.latLng(-0.06358925013978478, -78.42609322912877)
    // );

    constructor(
        private mapService: MapService,
        private utilsService: UtilsService,
        private localizationService: LocalizationService
    ) { }

    async ngOnInit() { }

    async ngAfterViewInit() {
        //Loading Cargar Mapa y Mostrarlo
        this.mapLoading = await this.utilsService.createBasicLoading('Cargando Mapa');
        this.mapLoading.present();
        // Obtener marcadores
        this.mapMarkers = await this.mapService.getMarkers().toPromise();
        // Obtener Coordenadas
        this.currentCoordinate = await this.localizationService.getCoordinate();
        // Inicializar el Mapa
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
        if (this.enableGesture) {
            Leaflet.Map.addInitHook('addHandler', 'gestureHandling', GestureHandling);
        }
        // Crear el Mapa
        this.map = Leaflet.map(this.idMap, {
            gestureHandling: this.enableGesture,
            zoomAnimation: true,
            markerZoomAnimation: true,
            zoomControl: true
        });

        // Agregar Evento al Mapa cuando esta cargado
        this.map.on('load', (e) => {
            this.mapIsLoaded = true;
            // Apagar el loading
            this.mapLoading.dismiss();
            // Invalidar Tamanio
            this.map.invalidateSize();
            // Enviar informacion mapa al padre
            this.sendMapInfo();
        });
        this.map.zoomControl.setPosition('topright');
        // Configurar la vista centrada
        // Leaflet.control.zoom({ position: 'topright' }).addTo(this.map);
        this.map.setView([-0.1548643, -78.4822049], this.zoomMap);
        // this.map.flyTo([-0.1548643, -78.4822049], this.zoomMap);
        // Agregar la capa del Mapa
        Leaflet.tileLayer(environment.googleMapLayer.url, {
            attribution: environment.googleMapLayer.attribution,
            maxZoom: 18,
            updateWhenIdle: true,
            reuseTiles: true
        }).addTo(this.map);

        // Añadir Polilinea al Mapa
        this.currentPolyline.addTo(this.map);
        // Añadir el control de escala
        // Leaflet.control.scale({ position: 'bottomleft' }).addTo(this.map);
        // Si obtuve coordenadas añadir el marcador
        if (this.currentCoordinate !== null) {
            const iconCurrent = await this.mapService.getCustomIcon('red');
            let currentPoint;
            if (iconCurrent) {
                // tslint:disable-next-line: max-line-length
                currentPoint = new Leaflet.Marker(new Leaflet.latLng([this.currentCoordinate.latitude, this.currentCoordinate.longitude]), { icon: iconCurrent, title: 'Mi Posición Actual' });
            } else {
                // tslint:disable-next-line: max-line-length
                currentPoint = new Leaflet.Marker(new Leaflet.latLng([this.currentCoordinate.latitude, this.currentCoordinate.longitude]), { title: 'Mi Posición Actual' });
            }
            currentPoint.addTo(this.map).bindPopup('Mi Ubicación').openPopup();
        }
        console.log('map points', this.mapPoints);
        //Recorrer los puntos del mapa
        this.mapPoints.forEach(async point => {
            let punto = null;
            const title = `${point.name}`;
            const markerIcon = await this.mapService.getCustomIcon('green');
            if (markerIcon) {
                // tslint:disable-next-line: max-line-length
                punto = new Leaflet.Marker(new Leaflet.latLng(
                    point.ubication.latitude,point.ubication.longitude), { title, icon: markerIcon });
            } else {
                // tslint:disable-next-line: max-line-length
                punto = new Leaflet.Marker(new Leaflet.latLng(point.ubication.latitude, point.ubication.longitude), { title });
            }
            // Evento marcador al hacer click para mostrar información
            punto.on('click', (e) => { this.showInfo(e); });
            // Añadir el punto al marcador
            this.markersLayer.addLayer(punto);
        });

        const searchControl = new LeafletSearch({
            position: 'topleft',
            layer: this.markersLayer,
            initial: false,
            textPlaceholder: 'Buscar...',
            autoCollapse: true,
            autoCollapseTime: 2000,
            // Function al mover localización
            moveToLocation: (latlng, title, map) => {
                console.log(latlng);
                console.log(map);
                console.log(`Move Location => current: ${this.currentCoordinate} destino: ${latlng}`);
                // console.log(title);
                // console.log(map);
                this.map = map;
                // this.map.setView(latlng, this.zoomMap);
               
                // this.map.flyTo(latlng, this.zoomMap);
                if (this.currentCoordinate !== null) {
                    this.latlngsOrigDest[0] = [this.currentCoordinate.latitude, this.currentCoordinate.longitude];
                    this.latlngsOrigDest[1] = [latlng.lat, latlng.lng];
                    // console.log('tatlng: ', this.latlngsOrigDest);
                    this.currentPolyline.setLatLngs(this.latlngsOrigDest);
                    this.map.fitBounds(this.currentPolyline.getBounds())
                    this.currentPolyline.redraw();
                }
            }
        });

        this.map.addLayer(this.markersLayer);

        this.map.addControl(searchControl);
        searchControl.on('search:collapsed', (e) => {
            // console.log(e);
        });
    }

    async sendMapInfo() {
        await this.returnMapLoaded.emit({
            mapisLoad: this.mapIsLoaded,
            serviceSelected: this.currentService,
            currentLocation: this.currentCoordinate,
            markerSelected : this.markerSelected
        });
        this.markerSelected = false;
    }

    showInfo(e) {
        let selectedMarker = null;
        // console.log(e);
        // console.log(this.mapPoints);
        this.mapPoints.forEach((point) => {
            if (point.ubication.latitude === e.latlng.lat && point.ubication.longitude === e.latlng.lng) {
                selectedMarker = point;
            }
        });
        this.currentService = selectedMarker;
        this.markerSelected = true;
        this.sendMapInfo();
    }

    // preventMoveOutLimits() {
    //     this.map.on('moveend', () => {
    //         // code stuff
    //         if (this.strictBounds.contains(this.map.getCenter())) {
    //             return;
    //         }
    //         // We're out of bounds - Move the map back within the bounds
    //         const c = this.map.getCenter();
    //         console.log('ccc', c);
    //         let x = c.lng;
    //         let y = c.lat;
    //         const maxX = this.strictBounds.getNorthEast().lng;
    //         const maxY = this.strictBounds.getNorthEast().lat;
    //         const minX = this.strictBounds.getSouthWest().lng;
    //         const minY = this.strictBounds.getSouthWest().lat;

    //         if (x < minX) { x = minX; }
    //         if (x > maxX) { x = maxX; }
    //         if (y < minY) { y = minY; }
    //         if (y > maxY) { y = maxY; }

    //         setTimeout(() => {
    //             this.map.panTo(new Leaflet.latLng(y, x));
    //         }, 1000);
    //     });
    // }

}

