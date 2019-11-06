import 'leaflet-routing-machine';
import * as LeafletSearch from 'leaflet-search';
import { manageTwoFingerDrag } from 'src/app/helpers/utils';
import { GestureHandling } from "leaflet-gesture-handling";
declare let L: any;
import { Component, OnInit, Input, AfterViewInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { MapService } from 'src/app/services/map.service';
import { UtilsService } from 'src/app/services/utils.service';
import { IPublicService } from 'src/app/interfaces/models';
import { LocalizationService } from 'src/app/services/localization.service';
import { environment } from "src/environments/environment";

@Component({
    selector: 'multiple-map',
    templateUrl: './multiple-map.component.html',
    styleUrls: ['./multiple-map.component.scss'],
})
export class MultipleMapComponent implements OnInit, AfterViewInit {

    @Input() id: string;
    @Input() className = '';
    @Input() zoomMap = 16;
    @Input() mapPoints: IPublicService[] = [];
    @Input() enableGesture = false;
    @Output() returnMapLoaded = new EventEmitter();

    usePolyline = true;
    polylineRoute: any;
    map: any;
    mapMarkers: any[] = null;
    mapIsLoaded = false;
    markersLayer = new L.LayerGroup();
    currentUserLayer = new L.LayerGroup();
    markerSelected = false;
    currentService = null;
    currentCoordinate: any = null;
    mapLoading = null;
    @ViewChild("multipleMap") mapDOM: ElementRef;

    constructor(
        private mapService: MapService,
        private utilsService: UtilsService,
        private localizationService: LocalizationService
    ) {
        this.polylineRoute= L.polyline([
            [0.27672266086355024, -81.6663098484375]
        ],
            {
                color: '#ee0033',
                weight: 8,
                opacity: .8,
                dashArray: '20,15',
                lineJoin: 'round'
            }
        );
     }

    async ngOnInit() { }

    createLatLng(latitude: number, longitude: number) {
        return L.latLng(latitude, longitude);
    }

    createWayPoints(lat1: number, lng1: number, lat2: number, lng2: number) {
        return [this.createLatLng(lat1, lng1), this.createLatLng(lat2, lng2)];
    }

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
        //Mover Mapa con Dos Dedos
        if (this.enableGesture) {     
            this.mapDOM.nativeElement.addEventListener("touchstart", manageTwoFingerDrag);
            this.mapDOM.nativeElement.addEventListener("touchend", manageTwoFingerDrag);
        }
    }

    onTwoFingerDrag(e: any) {
        if (e.type === 'touchstart' && e.touches.length === 1) {
            e.currentTarget.classList.add('swiping');
        } else {
            e.currentTarget.classList.remove('swiping');
        }
    }

    async initializeMap() {
        if (this.enableGesture) {
            L.Map.addInitHook("addHandler", "gestureHandling", GestureHandling);
        }
        // Crear el Mapa
        this.map = L.map(this.id, {
            gestureHandling: this.enableGesture,
            zoomAnimation: true,
            markerZoomAnimation: true,
            zoomControl: true
        });
        // Agregar Evento al Mapa cuando esta cargado
        this.map.on('load', (e: any) => {
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
        this.map.setView([-0.1548643, -78.4822049], this.zoomMap);
        // Agregar la capa del Mapa
        L.tileLayer(environment.mapLayers.google.url, {
            attribution: environment.mapLayers.google.attribution,
            maxZoom: 18,
            updateWhenIdle: true,
            reuseTiles: true
        }).addTo(this.map);
        //Añadir Ruta Polyline
        this.polylineRoute.addTo(this.map);
        // Si obtuve coordenadas añadir el marcador
        if (this.currentCoordinate) {
            const iconCurrent = await this.mapService.getCustomIcon('red');
            let currentPoint: any;
            const iconLatLng = L.latLng(this.currentCoordinate.latitude, this.currentCoordinate.longitude);
            if (iconCurrent) {
                currentPoint = new L.Marker(iconLatLng, { icon: iconCurrent, title: 'Mi Posición Actual' });
            } else {
                currentPoint = new L.Marker(iconLatLng, { title: 'Mi Posición Actual' });
            }
            currentPoint.addTo(this.map).bindPopup('Mi Ubicación').openPopup();
        }
        console.log('map points', this.mapPoints);
        //Recorrer los puntos del mapa
        this.mapPoints.forEach(async point => {
            let punto = null;
            const title = `${point.name}`;
            const markerIcon = await this.mapService.getCustomIcon('green');
            const leafletLatLng = L.latLng(point.ubication.latitude, point.ubication.longitude);
            if (markerIcon) {
                punto = new L.Marker(leafletLatLng, { title, icon: markerIcon});
            } else {
                punto = new L.Marker(leafletLatLng, { title });
            }
            // Evento marcador al hacer click para mostrar información
            punto.on('click', (e: any) => { this.showInfo(e); });
            // Añadir el punto al marcador
            this.markersLayer.addLayer(punto);
        });

        const searchControl = new LeafletSearch({
            position: 'topleft',
            layer: this.markersLayer,
            // initial: false,
            textPlaceholder: 'Buscar...',
            autoCollapse: true,
            autoCollapseTime: 2000,
            // Function al mover localización
            moveToLocation: async (latlng, title, map) => {
                this.map = map;
                if (this.currentCoordinate) {
                    console.log('Redraw route', title);
                    const wp1 = this.createLatLng(this.currentCoordinate.latitude, this.currentCoordinate.longitude);
                    this.polylineRoute.setLatLngs([wp1, latlng]);
                    this.map.fitBounds(this.polylineRoute.getBounds());
                }
            }
        });

        this.map.addLayer(this.markersLayer);
        this.map.addControl(searchControl);
        searchControl.on('search:collapsed', (e: any) => { });
    }

    async sendMapInfo() {
        this.returnMapLoaded.emit({
            mapisLoad: this.mapIsLoaded,
            serviceSelected: this.currentService,
            currentLocation: this.currentCoordinate,
            markerSelected: this.markerSelected
        });
        this.markerSelected = false;
    }

    showInfo(e: any) {
        let selectedMarker = null;
        this.mapPoints.forEach((point) => {
            if (point.ubication.latitude === e.latlng.lat && point.ubication.longitude === e.latlng.lng) {
                selectedMarker = point;
            }
        });
        this.currentService = selectedMarker;
        this.markerSelected = true;
        this.sendMapInfo();
    }

}

