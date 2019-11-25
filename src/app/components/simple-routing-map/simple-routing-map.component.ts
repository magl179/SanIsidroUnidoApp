import 'leaflet';
import 'leaflet-routing-machine';
declare let L: any;
import { GestureHandling } from "leaflet-gesture-handling";
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MapService } from "src/app/services/map.service";
import { LocalizationService } from "src/app/services/localization.service";
import { environment } from 'src/environments/environment';
import { IUbication } from "src/app/interfaces/models";
import { CONFIG } from 'src/config/config';


@Component({
    selector: 'simple-routing-map',
    templateUrl: './simple-routing-map.component.html',
    styleUrls: ['./simple-routing-map.component.scss'],
})
export class SimpleRoutingMapComponent implements OnInit {


    @Input() id: string;
    @Input() className = '';
    @Input() zoom = 16;
    @Input() destinationCoords: IUbication;
    @Input() enableGesture = false;
    @Input() usePolyline = true;
    @Output() mapEvent = new EventEmitter();


    polylineRoute: any;
    map: any;
    mapMarkers: any[] = null;
    mapIsLoaded = false;
    markersLayer = new L.LayerGroup();
    currentCoordinate: any = null;
    routeControl: any;

    arrRoutesLatLng = [];

    constructor(
        private mapService: MapService,
        private localizationService: LocalizationService
    ) {

    }

    async ngOnInit() { }


    async ngAfterViewInit() {
        try {     
            this.mapMarkers = await this.mapService.getMarkers().toPromise();
            // Obtener Coordenadas
            this.currentCoordinate = await this.localizationService.getCoordinate();
            // Inicializar el Mapa
            await this.initializeMap();
        } catch (err) {
            
        }
        // Obtener marcadores
    }

    async initializeMap() {
        if (this.enableGesture) {
            L.Map.addInitHook("addHandler", "gestureHandling", GestureHandling);
        }
        //Setear las Coordenadas de tipo LatLng
        this.arrRoutesLatLng[0] = this.createLatLng(this.currentCoordinate.latitude, this.currentCoordinate.longitude);
        this.arrRoutesLatLng[1] = this.createLatLng(this.destinationCoords.latitude, this.destinationCoords.longitude);
        // Crear el Mapa
        console.log('crear mapa')
        this.map = L.map(this.id, {
            gestureHandling: this.enableGesture,
            zoomAnimation: true,
            markerZoomAnimation: true,
            zoomControl: true
        });
        // Agregar Evento al Mapa cuando esta cargado
        this.map.on('load', (e: any) => {
            console.log('Simple coordinate map loaded')
            this.mapIsLoaded = true;
            // Invalidar Tamanio
            this.map.invalidateSize();
            this.mapEvent.emit({
                loaded : true
            });
        });
        this.map.zoomControl.setPosition('topright');
        // Configurar la vista centrada
        this.map.setView([-0.1548643, -78.4822049], this.zoom);
        // Agregar la capa del Mapa
        L.tileLayer(CONFIG.MAPLAYERS.GOOGLE.URL, {
            attribution: CONFIG.MAPLAYERS.GOOGLE.ATRIBUTION,
            maxZoom: 18,
            updateWhenIdle: true,
            reuseTiles: true
        }).addTo(this.map);
        //Añadir la Ruta en caso de ser necesario
        if (!this.usePolyline) {
            this.setRoutingMachine(this.arrRoutesLatLng);
        }
        this.map.addLayer(this.markersLayer);
        // Si obtuve coordenadas añadir el marcador
        if (this.currentCoordinate) {
            const iconCurrent = await this.mapService.getCustomIcon('red');
            let currentPoint: any;
            this.arrRoutesLatLng[0] = this.createLatLng(this.currentCoordinate.latitude, this.currentCoordinate.longitude);
            if (iconCurrent) {
                currentPoint = new L.Marker(this.arrRoutesLatLng[0], { icon: iconCurrent, title: 'Mi Posición Actual' });
            } else {
                currentPoint = new L.Marker(this.arrRoutesLatLng[0], { title: 'Mi Posición Actual' });
            }
            currentPoint.bindPopup('Mi Ubicación Actual').openPopup();
            this.markersLayer.addLayer(currentPoint);
        }
        //Añadir el destino final
        let punto = null;
        const markerIcon = await this.mapService.getCustomIcon('green');

        if (markerIcon) {
            punto = new L.Marker(this.arrRoutesLatLng[1], { icon: markerIcon });
        } else {
            punto = new L.Marker(this.arrRoutesLatLng[1]);
        }
        // Añadir el punto a la capa de marcadores
        this.markersLayer.addLayer(punto);
        //Añado la polilinea de ser necesario
        if (this.usePolyline) {
            this.addPolyline(this.arrRoutesLatLng);
        }

    }

    addPolyline(arrayCoordsLatLng: any) {
        this.polylineRoute = L.polyline(arrayCoordsLatLng,
            {
                color: '#ee0033',
                weight: 8,
                opacity: .8,
                dashArray: '20,15',
                lineJoin: 'round'
            }
        );
        //Añadir Ruta Polyline
        this.markersLayer.addLayer(this.polylineRoute);
        this.map.fitBounds(this.polylineRoute.getBounds());
    }

    setRoutingMachine(arrCoords: any) {
        this.routeControl = L.Routing.control({
            waypoints: arrCoords,
            show: false,
            routeWhileDragging: false,
            router: new L.Routing.mapbox(environment.MAPBOX_APIKEY),
            createMarker: function () { return null; }
        });
        this.routeControl.addTo(this.map);
    }

    updateRouteCoords(arrCoords: any[]) {
        this.routeControl.setWaypoints(arrCoords);
    }

    createLatLng(latitude: number, longitude: number) {
        return L.latLng(latitude, longitude);
    }
}
