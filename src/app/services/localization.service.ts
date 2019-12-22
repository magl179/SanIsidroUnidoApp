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

    getPositionNative() {
        return this.geolocation.getCurrentPosition();
    }

    async getCoordinates() {
        try {
            return this.getLocationCoordinates();
        } catch (err) {
            console.log('err', err)
            throw (err);
        }
    }

    async getLocationCoordinates() {
        return new Promise(async (resolve, reject) => {
            if (this.platform.is('cordova')) {
                await this.requestGPSPermission();
                this.getPositionNative().then((currentCoords: any) => {
                    console.log('native current coords', currentCoords);
                    this.misCoordenadas.latitude = currentCoords.coords.latitude;
                    this.misCoordenadas.longitude = currentCoords.coords.longitude;
                    resolve(this.misCoordenadas);
                }).catch(err => reject(err));
            } else {
                if (navigator.geolocation) {
                    this.getPositionWeb().then((currentCoords: any) => {
                        this.misCoordenadas.latitude = currentCoords.coords.latitude;
                        this.misCoordenadas.longitude = currentCoords.coords.longitude;
                        resolve(this.misCoordenadas);
                    }).catch(err => reject(err))
                }
            }
        });
    }

    async checkGPSPermissions() {
        // console.log('verificar permisos gps')
        return new Promise(async (resolve, reject) => {
            await this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(
                async (result: any) => {
                    if (result.hasPermission) {
                        // console.log('pedir encender gps en verificar permisos gps')
                        resolve(this.askTurnOnGPS());
                    } else {
                        // console.log('solicitar permisos gps en verificar permisos gps')
                        resolve(this.requestGPSPermission());
                    }

                }
            ).catch(err => reject(err));
        });
    }

    async requestGPSPermission() {
        // console.log('solicitar permisos gps');
        return new Promise((resolve, reject) => {
            return this.locationAccuracy.canRequest().then(async (canRequest: boolean) => {
                if (canRequest) {
                    // console.log('pedir encender gps  en solicitar permisos gps');
                    resolve(this.askTurnOnGPS());
                } else {
                    // console.log('verificar permisos gps  en solicitar permisos gps' );
                    resolve(this.checkGPSPermissions());
                }
            }).catch(err => reject(err));
        });
    }

    //Solicitar al usuario que encienda el GPS
    async askTurnOnGPS() {
        // console.log('pedir encender gps')
        return new Promise((resolve, reject) => {
            this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
                (resp) => {
                    resolve(resp);
                }
            ).catch((err) => reject(err));
        });
    }
}
