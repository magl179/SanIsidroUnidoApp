import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network/ngx';
import { Platform } from '@ionic/angular';
import { Observable, fromEvent, merge, of, BehaviorSubject, from, Observer } from 'rxjs';
import { mapTo } from "rxjs/operators";
import { HttpClient } from '@angular/common/http';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { MessagesService } from './messages.service';
import { GEOLOCATION_ERRORS } from '../helpers/utils';


@Injectable({
    providedIn: 'root'
})
export class GeolocationService {

    private gpsEnabled: Observable<boolean> = null;
    private coordinates: Observable<any> = null;
    private hasGPSPermissions = new BehaviorSubject(false);
    private hasCoordinates = new BehaviorSubject(false);

    constructor(
        private network: Network,
        private platform: Platform,
        private androidPermissions: AndroidPermissions,
        private locationAccuracy: LocationAccuracy,
        private messageService: MessagesService,
        private httpClient: HttpClient) {

        if (this.platform.is('cordova')) {
            //Función si estamos en un dispositivo para subscribirnos a los 
            // eventos on connect y disconnect de la red de internet
            // this.network.onConnect().subscribe(() => {
            //     this.hasConnection.next(true);
            //     return;
            // });
            // this.network.onDisconnect().subscribe(() => {
            //     this.hasConnection.next(false);
            //     return;
            // });
            return;
        } else {
            //Función si estamos en un navegador para subscribirnos a los 
            // eventos on connect y disconnect de la red de internet
            // this.gpsEnabled = merge(
            //     of(navigator.geolocation),
            //     fromEvent(window, 'online').pipe(mapTo(true)),
            //     fromEvent(window, 'offline').pipe(mapTo(false))
            // );
            // this.online.subscribe((isOnline) => {
            //     if (isOnline) {
            //         this.hasConnection.next(true);
            //     } else {
            //         this.hasConnection.next(false);
            //     }
            // });
            //this.getLocationWeb();
        }
        //Realizar una prueba de conección
        //this.testNetworkConnection();
    }


    //Función obtener el tipo de red a la que estamos conectados
    public getLocationWeb(geoLocationOptions?: any): Observable<any> {
        geoLocationOptions = geoLocationOptions || { timeout: 5000 };

        return Observable.create(observer => {

            if (window.navigator && window.navigator.geolocation) {
                window.navigator.geolocation.getCurrentPosition(
                    (position) => {
                        observer.next(position);
                        observer.complete();
                    },
                    observer.error.bind(observer)
                    // (error) => {
                    //     switch (error.code) {
                    //         case 1:
                    //             observer.error(GEOLOCATION_ERRORS['errors.location.permissionDenied']);
                    //             break;
                    //         case 2:
                    //             observer.error(GEOLOCATION_ERRORS['errors.location.positionUnavailable']);
                    //             break;
                    //         case 3:
                    //             observer.error(GEOLOCATION_ERRORS['errors.location.timeout']);
                    //             break;
                    //     }
                    // }
                    ,
                    geoLocationOptions);
            } else {
                observer.error(GEOLOCATION_ERRORS['errors.location.unsupportedBrowser']);
            }

        });



    }



    async checkInitialGPSPermissions() {
        //Verificar Permisos Android
        const androidPermissions: any = await this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION);
        if (androidPermissions.hasPermission) {
            this.hasGPSPermissions.next(true)
            // return;
        }
        //Verificar si puedo pedir Localizacion
        const canRequestLocation = await this.locationAccuracy.canRequest();
        if (canRequestLocation) {
            this.hasGPSPermissions.next(true);
        } else {
            this.hasGPSPermissions.next(false);
        }

    }
}

// export let geolocationServiceInjectables: Array<any> = [
//     {provide: GeoLocationService, useClass: GeoLocationService }
// ];