import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import * as Leaflet from 'leaflet';
import { ReverseGeocodeResponse } from '../interfaces/barrios';
import { Observable } from 'rxjs';


const shadowIcon = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png';
const REVERSE_GEOCODING_ENDPOINT = 'https://nominatim.openstreetmap.org/reverse';

@Injectable({
    providedIn: 'root'
})
export class MapaService implements OnInit {

    constructor(private http: HttpClient) { }

    ngOnInit() {
        // console.log(this.getMarkers());
    }

    getMarkers() {
        return this.http.get<any[]>('assets/data/markers.json');
    }

    createIcon(ownIcon) {
        const iconoMapa = new Leaflet.Icon({
            iconUrl: ownIcon,
            shadowUrl: shadowIcon,
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        });
        return iconoMapa;
    }

    async crearMarcador(markers, puntoUbicacion) {
        const iconData = markers.filter((marker) => marker.color === puntoUbicacion.iconColor);
        const iconMapa = this.crearIcono(iconData[0].iconURL);
        const newIcon = new Leaflet.marker([
            puntoUbicacion.latitude,
            puntoUbicacion.longitude
        ], { icon: iconMapa });
        return newIcon;
    }

    crearIcono(ownIcon) {
        const iconoMapa = new Leaflet.Icon({
            iconUrl: ownIcon,
            shadowUrl: shadowIcon,
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        });
        return iconoMapa;
    }

    getAddress(coords): Observable<ReverseGeocodeResponse> {
        // ReverseGeocodeResponse
        const lat = coords.lat || '';
        const lng = coords.lng || '';
        const zoom = coords.zoom || 16;
        const addressdetails = 0;
        const addressParams = {
            format: 'json',
            zoom: zoom.toString(),
            addressdetails: addressdetails.toString(),
            lat: lat.toString(),
            lon: lng.toString()
        };
        return this.http.get<ReverseGeocodeResponse>(REVERSE_GEOCODING_ENDPOINT, { params: addressParams });
    }
}
