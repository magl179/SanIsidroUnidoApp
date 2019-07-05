import { Component, OnInit, Input, AfterViewInit, Output, EventEmitter } from '@angular/core';
import * as Leaflet from 'leaflet';
import { GestureHandling } from 'leaflet-gesture-handling';
import { MapaService } from 'src/app/services/mapa.service';
import { UtilsService } from '../../services/utils.service';

import { UbicationItem } from 'src/app/interfaces/barrios';

const shadowIcon = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png';

@Component({
    selector: 'multiple-map',
    templateUrl: './multiple-map.component.html',
    styleUrls: ['./multiple-map.component.scss'],
})
export class MultipleMapComponent implements OnInit, AfterViewInit {

    @Input() idMapa: string;
    @Input() zoomMap: number;
    @Input() puntosMapa: UbicationItem[] = [];
    @Input() enableGesture = false;
    @Output() estadoCargaMapa = new EventEmitter();

    mapa: any;
    mapMarkers: any[] = null;
    mapIsLoaded = false;

    constructor(
        private mapaService: MapaService
    ) { }

    async ngOnInit() { }

    async ngAfterViewInit() {
        this.mapMarkers = await this.mapaService.getMarkers().toPromise();
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
        // console.log({ datosPadre: this.puntosMapa });
        if (this.enableGesture) {
            Leaflet.Map.addInitHook('addHandler', 'gestureHandling', GestureHandling);
        }
        this.mapa = Leaflet.map(this.idMapa, {
            gestureHandling: this.enableGesture,
            fadeAnimation: false,
            zoomAnimation: false,
            markerZoomAnimation: false
        });
        this.mapa.on('load', (e) => {
            Leaflet.control.scale().addTo(this.mapa);
            this.puntosMapa.forEach(async (marcador) => {
                const punto = await this.mapaService.crearMarcador(this.mapMarkers, marcador);
                punto.bindPopup(marcador.title)
                    .addTo(this.mapa);
            });
            this.mapIsLoaded = true;
            this.enviarEstadoCargaMapa();
        });
        this.mapa.setView([-0.1548643, -78.4822049], this.zoomMap);
        Leaflet.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: 'www.tphangout.com',
            maxZoom: 18,
            updateWhenIdle: true,
            reuseTiles: true
        }).addTo(this.mapa);
    }

    async enviarEstadoCargaMapa() {
        // console.log({ cargaMapa: this.mapIsLoaded });
        await this.estadoCargaMapa.emit({
            mapisLoad: this.mapIsLoaded
        });
    }

}

