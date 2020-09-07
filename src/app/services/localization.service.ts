import { Injectable } from '@angular/core';
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { Platform } from '@ionic/angular';
import { ISimpleCoordinates, GeolocationPosition, ICheckPermission } from 'src/app/interfaces/models';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { MessagesService } from './messages.service';
import { CONFIG } from 'src/config/config';


@Injectable({
    providedIn: 'root'
})
export class LocalizationService {

    misCoordenadas: ISimpleCoordinates = {
        latitude: CONFIG.DEFAULT_LOCATION.latitude,
        longitude: CONFIG.DEFAULT_LOCATION.longitude,
    };

    constructor(
        private geolocation: Geolocation,
        private diagnostic: Diagnostic,
        private androidPermissions: AndroidPermissions,
        private locationAccuracy: LocationAccuracy,
        private platform: Platform,
        private messageService: MessagesService,
    ) { }
    //Abrir localizacion
    openLocalizationSettings() {
        return this.diagnostic.switchToLocationSettings();
    }

    //Posicion Web
    getPositionWeb() {
        return new Promise((resolve, reject) => {
            return navigator.geolocation.getCurrentPosition(resolve, reject, {});
        });
    }
    //GPS WEB
    async checkGPSWebEnable() {
        return new Promise((resolve) => {
            navigator.geolocation.getCurrentPosition(() => {
                resolve(true);
            }, () => {
                resolve(false);
            });
        });
    }

    //Verificar GPS Nativo
    async checkGPSNativeEnable() {
        return new Promise(async (resolve, reject) => {
            await this.diagnostic.isLocationEnabled()
                .then((isEnabled) => {
                    if (isEnabled === false) {
                        resolve(false)
                    } else {
                        resolve(true)
                    }
                })
                .catch(() => {
                    this.messageService.showWarning('Por favor activa tu GPS');
                    reject(false)
                });
        });
    }

    // Verificar GPS Activado
    async checkGPSEnabled() {
        if (this.platform.is('cordova')) {
            return await this.checkGPSNativeEnable();
        } else {
            return await this.checkGPSWebEnable();
        }
    }

    //Verificar si el servicio de localización esta activo o no
    async locationStatus() {
        return new Promise((resolve, reject) => {
            this.diagnostic.isLocationEnabled().then((isEnabled) => {
                if (isEnabled === false) {
                    resolve(false);
                } else if (isEnabled === true) {
                    resolve(true);
                }
            })
                .catch((e) => {
                    reject(false);
                });
        });
    }

    //Verificar localizacion habilitada
    async checkLocationNativeEnabled() {
        return new Promise((resolve, reject) => {
            this.diagnostic.isLocationEnabled().then((isEnabled) => {
                if (isEnabled === false) {
                    this.messageService.showInfo('Por favor enciende el GPS');
                    resolve(false);
                } else if (isEnabled === true) {
                    this.checkGPSPermission().then((response) => {
                        resolve(true)
                    })
                        .catch((e) => {
                            reject(false);
                        });
                }
            })
                .catch((e) => {
                    this.messageService.showInfo('Por favor habilita la localización');
                    reject(false);
                });
        });
    }
    // Verificar si la aplicación tiene acceso al GPS
    async checkGPSPermission() {
        return new Promise((resolve, reject) => {
            this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(
                result => {
                    if (result.hasPermission) {
                        //Si se tiene permiso se pide acceder al GPS Dialogo
                        this.askToTurnOnGPS().then((response) => {
                            resolve(true);
                        }).catch(() => reject(false));
                    } else {
                        //Si no tiene permisos, se piden los permisos
                        this.requestGPSPermission().then(() => {
                            resolve(true);
                        }).catch(() => reject(false));
                    }
                },
                err => {
                    alert(err);
                    reject(false);
                });
        });
    }

    //Obtener localización
    async requestGPSPermission() {
        return new Promise((resolve, reject) => {
            this.locationAccuracy.canRequest().then((canRequest: boolean) => {
                if (canRequest) {
                    resolve(true);
                } else {
                    //Mostrar el dialogo para solicitar el GPS
                    this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(() => {
                        // Llamar al método para encender al GPS
                        this.askToTurnOnGPS().then((response) => {
                            resolve(true);
                        }).catch(() => reject(false));
                    },
                        error => {
                            reject(false);
                        });
                }
            });
        });
    }

    //Preguntar habilitar el GPS Celular
    async askToTurnOnGPS() {
        return new Promise((resolve, reject) => {
            this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(async () => {
                resolve(true);
            }).catch(() => reject(false));
        });
    }

    //Obtener localización de coordenadas
    async getCoordinates(): Promise<any> {
        return new Promise(async (resolve, reject) => {
            if (this.platform.is('cordova')) {
                await this.requestGPSPermission();
                setTimeout(async () => {
                    return await this.getNativeLocationCoordinates().then((native_coords: ISimpleCoordinates) => {
                        this.misCoordenadas.latitude = native_coords.latitude;
                        this.misCoordenadas.longitude = native_coords.longitude;
                        resolve(this.misCoordenadas);
                    }).catch((error_coords) => {
                        reject(error_coords)
                    });
                }, 700);
            } else {
                if (navigator.geolocation) {
                    return await this.getPositionWeb().then((currentCoords: GeolocationPosition) => {
                        this.misCoordenadas.latitude = currentCoords.coords.latitude;
                        this.misCoordenadas.longitude = currentCoords.coords.longitude;
                        resolve(this.misCoordenadas);
                    }).catch(error_coords => {
                        reject(error_coords);
                    });
                } else {
                    this.messageService.showInfo("tu dispositivo no tiene disponible la geolocalizacion");
                    return resolve(null);
                }
            }
        });
    }

    //Obtener localización nativa con el plugin de cordova
    async getNativeLocationCoordinates() {
        return new Promise((resolve, reject) => {
            this.geolocation.getCurrentPosition().then((resp) => {
                this.misCoordenadas.latitude = resp.coords.latitude;
                this.misCoordenadas.longitude = resp.coords.longitude;
                resolve(this.misCoordenadas);
            }).catch(() => {
                this.misCoordenadas.latitude = CONFIG.DEFAULT_LOCATION.latitude;
                this.misCoordenadas.longitude = CONFIG.DEFAULT_LOCATION.longitude;
                reject(this.misCoordenadas);
            });
        });
    }
}
