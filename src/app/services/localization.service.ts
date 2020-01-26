import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { Platform } from '@ionic/angular';
import { UtilsService } from './utils.service';
import { ISimpleCoordinates } from 'src/app/interfaces/models';
import { throwError } from 'rxjs';
import { MessagesService } from './messages.service';

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
        private platform: Platform,
        private messageService: MessagesService,
    ) { }

    getPositionWeb() {
        return new Promise(function (resolve, reject) {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });
    }

    getPositionNative() {
        return this.geolocation.getCurrentPosition({
            timeout: 5500
        });
    }

    async getCoordinates() {
        try {
            return await this.getLocationCoordinates();
        } catch (err) {
            console.log('err', err)
            this.messageService.showInfo("No pudimos obtener tus coordenadas :(");
            throw (err);
        }
    }

    async getLocationCoordinates() {
        return new Promise(async (resolve, reject) => {
            if (this.platform.is('cordova')) {
                await this.checkGPSPermissions().catch(err=>{
                    this.messageService.showInfo("Por favor habilita el acceso de la aplicación a tu ubicación");
                    console.log('err checkGPSPermissions', err)
                });
                this.getPositionNative().then((currentCoords: any) => {
                    // console.log('native current coords', currentCoords);
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
        // return await this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(
        //     async (result: any) => {
        //         if (result.hasPermission) {
        //             // console.log('pedir encender gps en verificar permisos gps')
        //             return await this.askTurnOnGPS();
        //         } else {
        //             // console.log('solicitar permisos gps en verificar permisos gps')
        //             return await this.requestGPSPermission();
        //         }

        //     }
        // ).catch(err => {
        //     throw (err);
        // });

        return new Promise(async(resolve, reject) => {
            await this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(
                async (result: any) => {
                    console.log('check permission', result)
                    if (result.hasPermission) {
                        // console.log('pedir encender gps en verificar permisos gps')
                        // return await this.askTurnOnGPS();
                        resolve(this.askTurnOnGPS());
                    } else {
                        // console.log('solicitar permisos gps en verificar permisos gps')
                        // return await this.requestGPSPermission();
                        resolve(this.requestGPSPermission());
                    }

                }
            ).catch(err => {
                // throw (err);
                reject(err);
            });
        });
    }

    async requestGPSPermission() {
        return new Promise(async(resolve, reject) => {
            // console.log('solicitar permisos gps');
            await this.locationAccuracy.canRequest().then(async (canRequest: any) => {
                console.log('can nrequets', canRequest)
                if (canRequest) {
                    // console.log('pedir encender gps  en solicitar permisos gps');
                    // return await this.askTurnOnGPS();
                    resolve(this.askTurnOnGPS());
                } else {
                    this.messageService.showInfo("Por favor habilita el acceso de la aplicación a la geolocalización");
                    // throwError('Por favor habilita el acceso de la aplicación a la geolocalización');
                    reject('Por favor habilita el acceso de la aplicación a la geolocalización');
                }
            }).catch(err => {
                reject(err);
            });
        });
    }

    //Solicitar al usuario que encienda el GPS
    async askTurnOnGPS() {
        // console.log('pedir encender gps')
        return new Promise(async(resolve, reject) => {
            await this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
                (resp) => {
                    console.log('location accuracy', resp)
                    resolve(resp);
                }
            ).catch((err) => reject(err));
        });
    }

    async checkInitialGPSPermissions() {
        if(this.platform.is('cordova')){
            const permisosGPS = new Promise(async(resolve, reject) => {
                await this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(
                    async (result: any) => {
                        // console.log('check permission', result)
                        if (result.hasPermission) {
                            resolve('tengo permisos para acceder al GPS');
                        } else {
                            // console.log('solicitar permisos gps en verificar permisos gps')
                            // return await this.requestGPSPermission();
                            return new Promise(async(resolve, reject) => {
                                // console.log('solicitar permisos gps');
                                await this.locationAccuracy.canRequest().then(async (canRequest: any) => {
                                    console.log('can request', canRequest)
                                    if (canRequest) {
                                        // console.log('puedo pedir enceder GPS');
                                        resolve('puedo pedir enceder GPS');
                                    } else {
                                        reject('Por favor habilita el acceso de la aplicación a la geolocalización');
                                    }
                                }).catch(err => {
                                    reject(err);
                                });
                            });
                        }
    
                    }
                ).catch(err => {
                    // throw (err);
                    reject(err);
                });
            });
            permisosGPS.then(res=>{console.log('res', res)}).catch(err=>{
                console.log('error', err);
            })
        }else{
            return;
        }
    }


}
