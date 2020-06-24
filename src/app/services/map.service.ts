import { Injectable, OnInit } from '@angular/core';
import * as Leaflet from 'leaflet';
import { IReverseGeocodeResponse } from 'src/app/interfaces/models';
import { Observable } from 'rxjs';
import { HttpRequestService } from "./http-request.service";
import { MARKERS_ICONS } from '../config/markers_icons';


const shadowIcon = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png';
const REVERSE_GEOCODING_ENDPOINT = 'https://nominatim.openstreetmap.org/reverse';

@Injectable({
    providedIn: 'root'
})
export class MapService implements OnInit {

    constructor(
        private httpRequest: HttpRequestService
    ) { }

    ngOnInit():void {}

    createExternalIcon(ownIconUrl: string) {
        const iconMap = new Leaflet.Icon({
            iconUrl: ownIconUrl,
            shadowUrl: shadowIcon,
            shadowSize: [40, 40],
            iconSize: [40, 40],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
        });
        return iconMap;
    }
    //Funcion crear un icono con una imagen específica
    createIcon(ownIconURL: string) {
        const iconMap = new Leaflet.Icon({
            iconUrl: ownIconURL,
            shadowUrl: shadowIcon,
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        });
        return iconMap;
    }
    //Función obtener un icono de un color en especifico
    async getCustomIcon(color: string) {
        let markerIcon = null;
        const markerData = MARKERS_ICONS;
        if (markerData) {
            const iconData = markerData.filter((dataMarker) => {
                return dataMarker.color === color;
            });
            if (iconData && iconData.length > 0) {
                markerIcon = this.createIcon(iconData[0].iconURL);
            }
        }
        return markerIcon;
    }
    //Función crear un marcador o array de marcadores
    async createMarker(markers, locationPoint) {
        const iconData = markers.filter((marker) => marker.color === locationPoint.iconColor);
        const iconMapa = this.createIcon(iconData[0].iconURL);
        const newIcon = Leaflet.marker([
            locationPoint.latitude,
            locationPoint.longitude
        ], { icon: iconMapa });
        return newIcon;
    }
    // Función para obtener la dirección de unas coordenadas
    getAddress(coords): Observable<IReverseGeocodeResponse> {
        const addressParams = {
            format: 'json',
            zoom: (coords.zoom) ? coords.zoom.toString(): '',
            addressdetails: '0',
            lat: (coords && coords.lat) ? coords.lat.toString(): '',
            lon: (coords && coords.lng) ? coords.lng.toString(): ''
        };
        return this.httpRequest.get(REVERSE_GEOCODING_ENDPOINT, addressParams);
    }

}
