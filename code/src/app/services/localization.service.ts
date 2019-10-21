import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { Platform } from '@ionic/angular';
import { UtilsService } from './utils.service';
import { ISimpleCoordinates } from 'src/app/interfaces/models';

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
                await this.checkGPSPermissions();
            } else {
                if (navigator.geolocation) {
                    const positionweb: any = await this.getPositionWeb();
                    this.misCoordenadas.latitude = positionweb.coords.latitude;
                    this.misCoordenadas.longitude = positionweb.coords.longitude;
                } else {
                    return this.misCoordenadas;
                }
            }
            return this.misCoordenadas;
        } catch (err) {
            console.log('Error: ', err);
            this.utilsService.showToast({message: 'Ocurrio un error al obtener la geolocalizacion'});
        }
    }

    async checkGPSPermissions() {
        if (this.platform.is('cordova')) {
            return await this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(
                async result => {
                    if (result.hasPermission) {
                        // Pedir encender GPS
                        await this.askTurnOnGPS();
                    } else {
                        // Pedir Permiso GPS
                        await this.requestGPSPermission();
                    }
                },
                (err: any) => {
                    this.utilsService.showToast({message: 'No se pudo obtener los permisos de GPS'});
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
                        },
                        (err: any) => {
                            this.utilsService.showToast({message: 'Ocurrio un error al solicitar los permisos del GPS: '});
                            console.log(err);
                        }
                    );
            }
        });
    }

    //Solicitar al usuario que encienda el GPS
    async askTurnOnGPS() {
        return await this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
            async () => {
                const currentCoords = await this.geolocation.getCurrentPosition();
                if (currentCoords) {
                    this.misCoordenadas.latitude = currentCoords.coords.latitude;
                    this.misCoordenadas.longitude = currentCoords.coords.longitude;
                }
                return;
            },
            (err: any) => {
                this.utilsService.showToast({message: 'Ocurrio un error al obtener los permisos de Localización'});
                console.log(err);
            }
        );
    }
}
