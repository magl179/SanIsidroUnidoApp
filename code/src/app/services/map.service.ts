import { Injectable, OnInit } from '@angular/core';
import * as Leaflet from 'leaflet';
import { IReverseGeocodeResponse } from 'src/app/interfaces/models';
import { Observable } from 'rxjs';
import { HttpRequestService } from "./http-request.service";


const shadowIcon = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png';
const REVERSE_GEOCODING_ENDPOINT = 'https://nominatim.openstreetmap.org/reverse';

@Injectable({
    providedIn: 'root'
})
export class MapService implements OnInit {

    constructor(
        private httpRequest: HttpRequestService
    ) { }

    ngOnInit() {}

    //Función para obtener los marcadores personalizados
    getMarkers() {
        return this.httpRequest.get('assets/data/markers.json');
    }
    //Funcion crear un icono con una imagen específica
    createIcon(ownIconURL) {
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
    async getCustomIcon(color) {
        let markerIcon = null;
        const markerData = await this.getMarkers().toPromise();
        if (markerData) {
            const iconData = markerData.filter((dataMarker) => {
                return dataMarker.color === color;
            });
            if (iconData && iconData.length > 0) {
                markerIcon = await this.createIcon(iconData[0].iconURL);
            }
        }
        return markerIcon;
    }
    //Función crear un marcador o array de marcadores
    async createMarker(markers, locationPoint) {
        const iconData = markers.filter((marker) => marker.color === locationPoint.iconColor);
        const iconMapa = this.createIcon(iconData[0].iconURL);
        const newIcon = new Leaflet.marker([
            locationPoint.latitude,
            locationPoint.longitude
        ], { icon: iconMapa });
        return newIcon;
    }
    // Función para obtener la dirección de unas coordenadas
    getAddress(coords): Observable<IReverseGeocodeResponse> {
        console.log('coordenadas conseguir direccion', coords);
        const addressParams = {
            format: 'json',
            zoom: (coords.zoom) ? coords.zoom.toString(): '',
            addressdetails: '0',
            lat: (coords && coords.lat) ? coords.lat.toString(): '',
            lon: (coords && coords.lng) ? coords.lng.toString(): ''
        };
        console.log('address params', addressParams);
        return this.httpRequest.get(REVERSE_GEOCODING_ENDPOINT, addressParams);
    }
    // Función para obtener la distancia en KM entre dos coordenadas
    getDistanceInKm(lat1,lon1,lat2,lon2) {
        let R = 6371;
        let dLat = (lat2-lat1) * (Math.PI/180);
        let dLon = (lon2-lon1) * (Math.PI/180);
        let a =
          Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(lat1 * (Math.PI/180)) * Math.cos(lat2 * (Math.PI/180)) *
          Math.sin(dLon/2) * Math.sin(dLon/2)
          ;
        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        let d = R * c;
        return d;
      }


}
