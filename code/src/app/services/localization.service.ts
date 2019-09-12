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

    getPositionWeb() {
        return new Promise(function (resolve, reject) {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
    }

    async getCoordinate() {
        try {
            if (this.platform.is('cordova')) {
                console.log('call before get coordinate');
                await this.checkGPSPermissions();
            } else {
                if (navigator.geolocation) {
                    const positionweb: any = await this.getPositionWeb();
                    this.misCoordenadas.latitude = positionweb.coords.latitude;
                    this.misCoordenadas.longitude = positionweb.coords.longitude;
                    // navigator.geolocation.getCurrentPosition((position) => {
                    //     console.log('positionweb', position);
                    //     this.misCoordenadas.latitude = position.coords.latitude;
                    //     this.misCoordenadas.longitude = position.coords.longitude;
                    //     return;
                    // });
                } else {
                    return this.misCoordenadas;
                }
                // console.log('antes return2', this.misCoordenadas);
            }
            // console.log('antes return', this.misCoordenadas);
            return this.misCoordenadas;
        } catch (err) {
            console.log('Error: ', err);
            this.utilsService.showToast('Error al obtener la geolocalizacion' + err);
        }
    }

    async checkGPSPermissions() {
        if (this.platform.is('cordova')) {
            return await this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(
                async result => {
                    if (result.hasPermission) {
                        // Pedir encender GPS
                        await this.askTurnOnGPS();
                        console.log('pedir encender gps');
                    } else {
                        // Pedir Permiso GPS
                        await this.requestGPSPermission();
                        console.log('obtener permisos gps');
                    }
                },
                err => {
                    this.utilsService.showToast('Fallo obtener los permisos de GPS');
                    console.log(err);
                }
            );
        } else {
            return;
        }
    }

    requestGPSPermission() {
        return this.locationAccuracy.canRequest().then((canRequest: boolean) => {
            if (canRequest) {
                return;
            } else {
                // Show 'GPS Permission Request' dialogue
                this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION)
                    .then(
                        async () => {
                            // Metodo Encender GPS
                            await this.askTurnOnGPS();
                            console.log('pedir encender gps');
                        },
                        err => {
                            this.utilsService.showToast('Error al pedir permisos al GPS: ');
                            console.log(err);
                        }
                    );
            }
        });
    }

    async askTurnOnGPS() {
        return await this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
            async () => {
                // When GPS Turned ON call method to get Accurate location coordinates
                console.log('You can request ubication');
                const currentCoords = await this.geolocation.getCurrentPosition();
                console.log('call after get coordinate');
                if (currentCoords) {
                    this.misCoordenadas.latitude = currentCoords.coords.latitude;
                    this.misCoordenadas.longitude = currentCoords.coords.longitude;
                    console.log('coordenadas obtenidas');
                }
                return;
            },
            err => {
                this.utilsService.showToast('Error al Obtener los Permisos de Localización');
                console.log(err);
            }
        );
    }
}
