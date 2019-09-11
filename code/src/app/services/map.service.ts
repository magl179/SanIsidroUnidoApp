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
        // console.log('get custom icon function called');
        const markerData = await this.getMarkers().toPromise();
        if (markerData) {
            const iconData = markerData.filter((dataMarker) => {
                return dataMarker.color === color;
            });
            // console.log('iconed data custom icon', iconData);
            if (iconData && iconData.length > 0) {
                markerIcon = await this.createIcon(iconData[0].iconURL);
            }
        }
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
