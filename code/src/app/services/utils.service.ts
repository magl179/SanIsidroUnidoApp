import { Injectable } from '@angular/core';

import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { ToastController, Platform, LoadingController } from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class UtilsService {

    misCoordenadas: {latitud: number, longitud: number} = {
        latitud: null,
        longitud: null
    };

    toastItem: any;

    constructor(
        private geolocation: Geolocation,
        private androidPermissions: AndroidPermissions,
        private locationAccuracy: LocationAccuracy,
        private toastCtrl: ToastController,
        private platform: Platform,
        private utilsService: UtilsService,
        private loadingCtrl: LoadingController
    ) { }

    ramdomValue(tamanio) {
        return Math.floor(Math.random() * tamanio);
    }

    async ramdomItem(array) {
        const valueRamdom = await this.ramdomValue(array.length);
        const item = array[valueRamdom];
        return item;
    }

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

    async mostrarToast(message?: string, duration?: number, color?: string, cssClass?: string, header?: string, position?: any) {
        this.toastItem = await this.toastCtrl.create({
            animated: true,
            message: message || 'Test Message Toast',
            duration: duration || 2000,
            color: color || 'dark',
            cssClass: cssClass || '',
            header: header || '',
            position: position || 'top'
        });
        this.toastItem.present();
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
                    this.mostrarToast('Fails to Android Permissions: ' + err);
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
                            this.mostrarToast('requestPermission Error requesting location permissions ' + error);
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
                this.mostrarToast('Error requesting location permissions ' + JSON.stringify(error));
            }
        );
    }

    async createBasicLoading(message: string = 'Cargando') {
        const basicloading = await this.loadingCtrl.create({
            message
        });
        console.log({ us_load: basicloading });
        return basicloading;
    }



}
