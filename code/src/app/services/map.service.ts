import { Injectable, OnInit } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import * as Leaflet from 'leaflet';
import { IReverseGeocodeResponse, IMarkers } from '../interfaces/barrios';
import { Observable } from 'rxjs';


const shadowIcon = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png';
const REVERSE_GEOCODING_ENDPOINT = 'https://nominatim.openstreetmap.org/reverse';

@Injectable({
    providedIn: 'root'
})
export class MapService implements OnInit {

    constructor(private http: HttpClient) { }

    ngOnInit() {}

    getMarkers() {
        return this.http.get<IMarkers[]>('assets/data/markers.json');
    }

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

    async getCustomIcon(color) {
        let markerIcon = null;
        const markerData = await this.getMarkers().toPromise();
        if (markerData) {
            const iconData = markerData.filter((dataMarker) => {
                return dataMarker.color === color;
            });
            console.log('iconed data custom icon', iconData);
            if (iconData && iconData.length > 0) {
                markerIcon = await this.createIcon(iconData[0].iconURL);
            }
        }
        // await this.getMarkers().subscribe(async data => {
        //     console.log('get custom icon data', data);
        //     if (data) {
        //         const iconData = data.filter((dataMarker) => {
        //             return dataMarker.color === color;
        //         });
        //         console.log('iconed data custom icon', iconData);
        //         if (iconData && iconData.length > 0) {
        //             markerIcon = await this.createIcon(iconData[0].iconURL);
        //         }
        //    }
        // });
        return markerIcon;
    }

    async createMarker(markers, locationPoint) {
        const iconData = markers.filter((marker) => marker.color === locationPoint.iconColor);
        const iconMapa = this.createIcon(iconData[0].iconURL);
        const newIcon = new Leaflet.marker([
            locationPoint.latitude,
            locationPoint.longitude
        ], { icon: iconMapa });
        return newIcon;
    }

    getAddress(coords): Observable<IReverseGeocodeResponse> {
        // ReverseGeocodeResponse
        const lat = coords.lat || '';
        const lng = coords.lng || '';
        const zoom = coords.zoom || 16;
        const addressParams = {
            format: 'json',
            zoom: zoom.toString(),
            addressdetails: '0',
            lat: lat.toString(),
            lon: lng.toString()
        };
        return this.http.get<IReverseGeocodeResponse>(REVERSE_GEOCODING_ENDPOINT, { params: addressParams });
    }
}
