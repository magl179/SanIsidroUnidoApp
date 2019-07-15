import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { Platform } from '@ionic/angular';
import { UtilsService } from './utils.service';
import { ISimpleCoordinates } from '../interfaces/barrios';

@Injectable({
    providedIn: 'root'
})
export class LocalizationService {

    misCoordenadas: ISimpleCoordinates = {
        latitude: null,
        longitude: null
    };

    constructor(
        private geolocation: Geolocation,
        private androidPermissions: AndroidPermissions,
        private locationAccuracy: LocationAccuracy,
        private utilsService: UtilsService,
        private platform: Platform
    ) { }

    async getCoordinate() {
        let canGetLocation = false;
        await this.geolocation.getCurrentPosition().then((resp) => {
            this.misCoordenadas.latitude = resp.coords.latitude;
            this.misCoordenadas.longitude = resp.coords.longitude;
            canGetLocation = true;
            console.log('UTILS SERVICE OBTUVE COORDENADAS');
        }).catch((error) => {
            this.utilsService.showToast('Error getting location' + error);
        });
        if (canGetLocation === false) {
            await this.checkGPSPermissions();
        }
        return this.misCoordenadas;
    }

    async checkGPSPermissions() {
        if (this.platform.is('cordova')) {
            await this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(
                result => {
                    if (result.hasPermission) {
                        // Pedir encender GPS
                        this.askTurnOnGPS();
                    } else {
                        // Pedir Permiso GPS
                        this.getGPSPermission();
                    }
                },
                err => {
                    this.utilsService.showToast('Fails to Android Permissions: ' + err);
                }
            );
        }
    }

    getGPSPermission() {
        this.locationAccuracy.canRequest().then((canRequest: boolean) => {
            if (canRequest) {
            } else {
                // Show 'GPS Permission Request' dialogue
                this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION)
                    .then(
                        () => {
                            // Metodo Encender GPS
                            this.askTurnOnGPS();
                        },
                        error => {
                            this.utilsService.showToast('No diste permisos ubicación: ' + error);
                        }
                    );
            }
        });
    }


    askTurnOnGPS() {
        this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
            () => {
                // When GPS Turned ON call method to get Accurate location coordinates
                console.log('You can request ubication');
            },
            error => {
                this.utilsService.showToast('Error requesting location permissions ' + JSON.stringify(error));
            }
        );
    }
}
