import { Component, OnInit, EventEmitter, Input, Output, AfterViewInit } from '@angular/core';
import * as Leaflet from 'leaflet';
import { GestureHandling } from 'leaflet-gesture-handling';
import { UtilsService } from '../../services/utils.service';
import { PostUbicationItem } from 'src/app/interfaces/barrios';

@Component({
    selector: 'single-map',
    templateUrl: './single-map.component.html',
    styleUrls: ['./single-map.component.scss'],
})
export class SingleMapComponent implements OnInit, AfterViewInit {

    @Input() idMapa: string;
    @Input() zoomMap: number;
    @Input() puntoMapa: PostUbicationItem;
    @Input() enableGesture = false;
    @Output() retornarCoordenadasEscogidas = new EventEmitter();

    mapa: any;
    mapIsLoaded = false;

    constructor(
        private utilsService: UtilsService
    ) { }

    async ngOnInit() {}

    async ngAfterViewInit() {
        await this.iniciarMapa();
    }

    onTwoFingerDrag(e) {
        if (e.type === 'touchstart' && e.touches.length === 1) {
            e.currentTarget.classList.add('swiping');
        } else {
            e.currentTarget.classList.remove('swiping');
        }
    }

    async iniciarMapa() {    
        if (this.enableGesture) {
            Leaflet.Map.addInitHook('addHandler', 'gestureHandling', GestureHandling);
        }
        this.mapa = await Leaflet.map(this.idMapa, {
            gestureHandling: this.enableGesture,
            fadeAnimation: false,
            zoomAnimation: false,
            markerZoomAnimation: false
        });

        await this.mapa.on('load', (e) => {
            console.log('MAPA SINGLE CARGADO');
            Leaflet.control.scale().addTo(this.mapa);
            this.mapIsLoaded = true;
        });
        this.mapa.setView([this.puntoMapa.latitude || -0.2188216, this.puntoMapa.longitude || -78.5135489], this.zoomMap || 15);;

        Leaflet.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: 'www.tphangout.com',
            maxZoom: 18,
            updateWhenIdle: true,
            reuseTiles: true
        }).addTo(this.mapa);

        const mainMarker = await Leaflet.marker([this.puntoMapa.latitude || -0.2188216, this.puntoMapa.longitude || -78.5135489], {
            title: this.puntoMapa.address || 'No hay direccion',
            draggable: true
        });
        mainMarker.on('dragend', async (e) => {
            const position = await e.target.getLatLng();
            this.puntoMapa.latitude = position.lat;
            this.puntoMapa.longitude = position.lng;
            this.enviarCoordenadasMarker();
        });
        this.mapa.addLayer(mainMarker);
        // this.enviarCoordenadasMarker();
    }
    
    // Cuando se lance el evento click en la plantilla llamaremos a este método
    async enviarCoordenadasMarker() {
        // Usamos el método emit
        // console.log({ ecM: this.puntoMapa });
        await this.retornarCoordenadasEscogidas.emit({
            lat: this.puntoMapa.latitude,
            lng: this.puntoMapa.longitude
        });
    }




}
