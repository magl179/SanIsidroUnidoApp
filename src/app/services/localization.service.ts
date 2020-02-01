import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { Platform } from '@ionic/angular';
import { UtilsService } from './utils.service';
import { ISimpleCoordinates } from 'src/app/interfaces/models';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
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
        private diagnostic: Diagnostic,
        private androidPermissions: AndroidPermissions,
        private locationAccuracy: LocationAccuracy,
        private utilsService: UtilsService,
        private platform: Platform,
        private messageService: MessagesService,
    ) { }

    getPositionWeb() {
        return new Promise((resolve, reject) => {
            return navigator.geolocation.getCurrentPosition(resolve, reject, { 
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            });
        });
    }

    async checkGPSEnabled() {
        if (this.platform.is('cordova')) {
            return await this.checkGPSNativeEnable();
        } else {
            return await this.checkGPSWebEnable();
        }
    }

    openLocalizationSettings() {
        return this.diagnostic.switchToLocationSettings();
    }

    async checkGPSWebEnable() {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition((coords: any) => {
                resolve(true);
            }, (err) => {
                resolve(false);
            });
        });
    }

    async checkGPSNativeEnable() {
        console.log('diagnostic', this.diagnostic)
        return new Promise(async(resolve, reject) => {
            console.log('diagnostic in promise', this.diagnostic)
            await this.diagnostic.isLocationEnabled()
            .then((enabled)=>resolve(enabled))
            .catch(err=>resolve(false));
        });
    }

    getPositionNative() {
        return this.geolocation.getCurrentPosition({
            // timeout: 15000,
            // maximumAge:60000
        });
    }

    async getCoordinates() {
        // try {
        //     return await this.getLocationCoordinates();
        // } catch (err) {
        //     console.log('err', err)
        //     this.messageService.showInfo("No pudimos obtener tus coordenadas :(");
        //     return null;
        // }
        console.log('get coordinates called')
        return await new Promise(async (resolve, reject) => {
            this.getLocationCoordinates().then(res=>{
                this.messageService.showInfo("pudimos obtener tus coordenadas :) GC");
                resolve(res);
            }).catch(err=>{
                this.messageService.showInfo("No pudimos obtener tus coordenadas :(");
                reject(err);                
            });
        });
    }



    async getLocationCoordinates() {
        return new Promise(async (resolve, reject) => {
            console.log(' getLocationCoordinates called');
            if (this.platform.is('cordova')) {
                console.log('is cordova getLocationCoordinates')
                // await this.checkGPSPermissions().catch(err=>{
                //     this.messageService.showInfo("Por favor habilita el acceso de la aplicación a tu ubicación");
                //     console.log('err checkGPSPermissions', err)
                // });
                return await this.getPositionNative().then((currentCoords: any) => {
                    console.log('native current coords', currentCoords);
                    this.misCoordenadas.latitude = currentCoords.coords.latitude;
                    this.misCoordenadas.longitude = currentCoords.coords.longitude;
                    resolve(this.misCoordenadas);
                }).catch(err => reject(err));
            } else {
                console.log('is web getLocationCoordinates')
                if (navigator.geolocation) {
                    console.log('is navigation geolocation disponibles')
                    return await this.getPositionWeb().then((currentCoords: any) => {
                        this.misCoordenadas.latitude = currentCoords.coords.latitude;
                        this.misCoordenadas.longitude = currentCoords.coords.longitude;
                        console.log('getPositionWeb then')
                        this.messageService.showInfo(" pudimos obtener tus coordenadas web :)");
                        resolve(this.misCoordenadas);
                    }).catch(err => {
                        console.log('getPositionWeb catch')
                        this.messageService.showInfo("No pudimos obtener tus coordenada webs :(");
                        reject(err);
                    });
                }else{
                    this.messageService.showInfo("No hay navigator geolocation");
                    return resolve(null);
                }
            }
        });
    }

    async checkGPSPermissions() {
        return new Promise(async (resolve, reject) => {
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
        return new Promise(async (resolve, reject) => {
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
        return new Promise(async (resolve, reject) => {
            await this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
                (resp) => {
                    console.log('location accuracy', resp)
                    resolve(true);
                }
            ).catch((err) => reject(err));
        });
    }

    async checkInitialGPSPermissions() {
        if (this.platform.is('cordova')) {
            //Verificar Permisos Android
            const androidPermissions: any = await this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION);
            if (androidPermissions.hasPermission) {
                this.messageService.showInfo('Tengo permisos GPS');
                return;
            }
            //Verificar si puedo pedir Localizacion
            const canRequestLocation = await this.locationAccuracy.canRequest();
            if (canRequestLocation) {
                this.messageService.showInfo('puedo pedir encender GPS');
                return;
            } else {
                this.messageService.showInfo('Por favor habilita el acceso de la aplicación a la geolocalización');
                return;
            }
        } else {
            return;
        }
    }
}
