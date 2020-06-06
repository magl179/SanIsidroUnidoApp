import 'leaflet';
import 'leaflet-routing-machine';
declare let L: any;
import { GestureHandling } from "leaflet-gesture-handling";
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MapService } from "src/app/services/map.service";
import { environment } from 'src/environments/environment';
import { IUbication, AppMapEvent, AppMarkers, ILeafletControl } from "src/app/interfaces/models";
import { CONFIG } from 'src/config/config';
import { MessagesService } from 'src/app/services/messages.service';
import { Control, Map, Polyline, Marker } from 'leaflet';


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
    @Input() simpleMap = false;
    @Input() targetUbicacionIcon = null;

    @Input() currentCoordinate = null;
    @Output() mapEvent = new EventEmitter<AppMapEvent>();

    polylineRoute: Polyline;
    map: any;
    mapMarkers: AppMarkers[] = null;
    mapIsLoaded = false;
    markersLayer = new L.LayerGroup();
    routeControl: ILeafletControl;
    arrRoutesLatLng = [];

    constructor(
        private mapService: MapService,
        private messageService: MessagesService,
    ) {
    }

    async ngOnInit() { }


    async ngAfterViewInit() {
        try {
            this.mapMarkers = await this.mapService.getMarkers().toPromise();
            // Inicializar el Mapa
            await this.initializeMap();
        } catch (map_error) {
            this.messageService.showInfo('No se pudo cargar el mapa, intentalo más tarde');
        }
    }

    async initializeMap() {
        if (this.enableGesture) {
            L.Map.addInitHook("addHandler", "gestureHandling", GestureHandling);
        }
        //Setear las Coordenadas de tipo LatLng
        this.arrRoutesLatLng[0] = this.createLatLng(
            (this.currentCoordinate) ? this.currentCoordinate.latitude : null, 
            (this.currentCoordinate) ? this.currentCoordinate.longitude : null);

        this.arrRoutesLatLng[1] = this.createLatLng(
            this.destinationCoords.latitude, this.destinationCoords.longitude);
        // Crear el Mapa
        this.map = L.map(this.id, {
            gestureHandling: this.enableGesture,
            zoomAnimation: false,
            markerZoomAnimation: false,
            zoomControl: true
        });
        // Agregar Evento al Mapa cuando esta cargado
        this.map.on('load', () => {
            this.mapIsLoaded = true;
            // Invalidar Tamanio
            this.map.invalidateSize();
            this.mapEvent.emit({
                loaded: true
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
        if (!this.simpleMap && CONFIG.SHOW_BEATIFUL_ROUTES) {
            this.setRoutingMachine(this.arrRoutesLatLng);
        }
        this.map.addLayer(this.markersLayer);
        // Añadir el marcador de mi posicion actual
        let currentPoint: Marker;
        if (this.currentCoordinate) {
            const iconCurrent = await this.mapService.getCustomIcon('red');
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
        let markersGroupCoords = [];
       
            const markerIcon = (this.targetUbicacionIcon) ? this.mapService.createExternalIcon(this.targetUbicacionIcon) : await this.mapService.getCustomIcon('red');

            if (markerIcon) {
                punto = new L.Marker(this.arrRoutesLatLng[1], { icon: markerIcon });
            } else {
                punto = new L.Marker(this.arrRoutesLatLng[1]);
            }
            // Añadir el punto a la capa de marcadores
            this.markersLayer.addLayer(punto);
            markersGroupCoords.push(this.arrRoutesLatLng[1]);
        
        //Añado la polilinea de ser necesario
        if (!this.simpleMap && !CONFIG.SHOW_BEATIFUL_ROUTES) {
            this.addPolyline(this.arrRoutesLatLng);
        }

        setTimeout(() => {
            this.map.fitBounds(markersGroupCoords);
        }, 1000);


    }

    addPolyline(arrayCoordsLatLng) {
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

    setRoutingMachine(arrCoords) {
        this.routeControl = L.Routing.control({
            waypoints: arrCoords,
            show: false,
            routeWhileDragging: false,
            router: new L.Routing.mapbox(environment.MAPBOX_APIKEY),
            createMarker: function () { return null; }
        });
        this.routeControl.addTo(this.map);
    }

    createLatLng(latitude: number, longitude: number) {
        return L.latLng(latitude, longitude);
    }
}
