import { Injectable } from '@angular/core';

import { Geolocation } from '@ionic-native/geolocation/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { Platform } from '@ionic/angular';
import { UtilsService } from './utils.service';

@Injectable({
    providedIn: 'root'
})
export class LocalizationService {

    misCoordenadas: {latitud: number, longitud: number} = {
        latitud: null,
        longitud: null
    };

    toastItem: any;

    constructor(
        private geolocation: Geolocation,
        private androidPermissions: AndroidPermissions,
        private locationAccuracy: LocationAccuracy,
        private utilsService: UtilsService,
        private platform: Platform
    ) { }

    async obtenerCoordenadas() {
        let canGetLocation = false;
        await this.geolocation.getCurrentPosition().then((resp) => {
            this.misCoordenadas.latitud = resp.coords.latitude;
            this.misCoordenadas.longitud = resp.coords.longitude;
            canGetLocation = true;
            console.log('UTILS SERVICE OBTUVE COORDENADAS');
        }).catch((error) => {
            this.utilsService.mostrarToast('Error getting location' + error);
        });
        if (canGetLocation === false) {
            await this.checkearPermisosGPS();
        }
        return this.misCoordenadas;
    }

    // Check if application having GPS access permission
    async checkearPermisosGPS() {
        if (this.platform.is('cordova')) {
            await this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(
                result => {
                    if (result.hasPermission) {
                        // If having permission show 'Turn On GPS' dialogue
                        this.pedirEncenderGPS();
                    } else {
                        // If not having permission ask for permission
                        this.obtenerPermisoGPS();
                    }
                },
                err => {
                    this.utilsService.mostrarToast('Fails to Android Permissions: ' + err);
                }
            );
        }
    }

    obtenerPermisoGPS() {
        this.locationAccuracy.canRequest().then((canRequest: boolean) => {
            if (canRequest) {
            } else {
                // Show 'GPS Permission Request' dialogue
                this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION)
                    .then(
                        () => {
                            // call method to turn on GPS
                            this.pedirEncenderGPS();
                        },
                        error => {
                            // Show alert if user click on 'No Thanks'
                            this.utilsService.mostrarToast('requestPermission Error requesting location permissions ' + error);
                        }
                    );
            }
        });
    }


    pedirEncenderGPS() {
        this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
            () => {
                // When GPS Turned ON call method to get Accurate location coordinates
                console.log('You can request ubication');
                // this.obtenerCoordenadas();
            },
            error => {
                this.utilsService.mostrarToast('Error requesting location permissions ' + JSON.stringify(error));
            }
        );
    }
}
