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
                }
            }
            
        } catch (err) {
            console.log('Error: ', err);
            await this.utilsService.showToast({ message: 'Ocurrio un error al obtener la geolocalizacion' });
        } finally {
            return this.misCoordenadas;
        }
    }

    async checkGPSPermissions() {
        return new Promise(async(resolve, reject) => { 
            if (this.platform.is('cordova')) {
                await this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(
                    async (result: any) => {
                        try {
                            if (result.hasPermission) {
                                // Pedir encender GPS
                                await this.askTurnOnGPS();
                            } else {
                                // Pedir Permiso GPS
                                await this.requestGPSPermission();
                            }
                        } catch (err) {
                            reject(err);
                        }
                    },
                    (err: any) => {
                        this.utilsService.showToast({message: 'No se pudo obtener los permisos de GPS'});
                        console.log(err);
                        reject(err);
                    }
                );
            } else {
                resolve(true);
            }
        });
    }

    async requestGPSPermission() {
        return new Promise((resolve, reject) => { 
            this.locationAccuracy.canRequest().then((canRequest: boolean) => {
                if (canRequest) {
                    resolve(true);
                } else {
                    // Show 'GPS Permission Request' dialogue
                    this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION)
                        .then(
                            async () => {
                                // Metodo Encender GPS
                                try {
                                    await this.askTurnOnGPS();
                                    resolve(true);
                                } catch (err) {
                                    reject(err);
                                }
                            },
                            (err: any) => {
                                this.utilsService.showToast({message: 'Ocurrio un error al solicitar los permisos del GPS: '});
                                console.log(err);
                                reject(err);
                            }
                        );
                }
            });
        });
    }

    //Solicitar al usuario que encienda el GPS
    async askTurnOnGPS() {
        return new Promise((resolve, reject) => {
            this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
                async () => {
                    try {     
                        const currentCoords = await this.geolocation.getCurrentPosition();
                        if (currentCoords) {
                            this.misCoordenadas.latitude = currentCoords.coords.latitude;
                            this.misCoordenadas.longitude = currentCoords.coords.longitude;
                        }
                        resolve(true);
                    } catch (err) {
                        reject(err);
                    }
                    // return;
                },
                (err: any) => {
                    this.utilsService.showToast({message: 'Ocurrio un error al obtener los permisos de Localización'});
                    console.log(err);
                    reject(err);
                }
            );
        });
    }
}
