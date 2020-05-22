import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { Platform } from '@ionic/angular';
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
        return new Promise((resolve) => {
            navigator.geolocation.getCurrentPosition(() => {
                resolve(true);
            }, () => {
                resolve(false);
            });
        });
    }

    async checkGPSNativeEnable() {
        return new Promise(async(resolve) => {
            await this.diagnostic.isLocationEnabled()
            .then((enabled)=>resolve(enabled))
            .catch(()=>resolve(false));
        });
    }

    getPositionNative() {
        return this.geolocation.getCurrentPosition({});
    }

    async getCoordinates() {
        return await new Promise(async (resolve, reject) => {
            this.getLocationCoordinates().then(response_coords=>{
                resolve(response_coords);
            }).catch((error_coordinate)=>{
                reject(error_coordinate);                
            });
        });
    }



    async getLocationCoordinates() {
        return new Promise(async (resolve, reject) => {
            if (this.platform.is('cordova')) {
                return await this.getPositionNative().then((currentCoords: any) => {
                    this.misCoordenadas.latitude = currentCoords.coords.latitude;
                    this.misCoordenadas.longitude = currentCoords.coords.longitude;
                    resolve(this.misCoordenadas);
                }).catch((error_coords) => reject(error_coords));
            } else {
                if (navigator.geolocation) {
                    return await this.getPositionWeb().then((currentCoords: any) => {
                        this.misCoordenadas.latitude = currentCoords.coords.latitude;
                        this.misCoordenadas.longitude = currentCoords.coords.longitude;
                        resolve(this.misCoordenadas);
                    }).catch(error_coords => {
                        reject(error_coords);
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
                    if (result.hasPermission) {
                        resolve(this.askTurnOnGPS());
                    } else {
                        resolve(this.requestGPSPermission());
                    }

                }
            ).catch(error_permissions => {
                reject(error_permissions);
            });
        });
    }

    async requestGPSPermission() {
        return new Promise(async (resolve, reject) => {
            await this.locationAccuracy.canRequest().then(async (canRequest: any) => {
                if (canRequest) {
                    resolve(this.askTurnOnGPS());
                } else {
                    this.messageService.showInfo("Por favor habilita el acceso de la aplicación a la geolocalización");
                    reject('Por favor habilita el acceso de la aplicación a la geolocalización');
                }
            }).catch(error_location => {
                reject(error_location);
            });
        });
    }

    //Solicitar al usuario que encienda el GPS
    async askTurnOnGPS() {
        return new Promise(async (resolve, reject) => {
            await this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
                () => {
                    resolve(true);
                }
            ).catch((error_gps) => reject(error_gps));
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
