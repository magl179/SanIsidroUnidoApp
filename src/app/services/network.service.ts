import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network/ngx';
import { Platform } from '@ionic/angular';
import { Observable, fromEvent, merge, of, BehaviorSubject, from } from 'rxjs';
import { mapTo, finalize } from "rxjs/operators";
import { HttpRequestService } from "./http-request.service";


@Injectable({
    providedIn: 'root'
})
export class NetworkService {

    private online: Observable<boolean> = null;
    private hasConnection = new BehaviorSubject(false);

    constructor(
        private network: Network,
        private platform: Platform,
        private httpRequest: HttpRequestService) {

        if (this.platform.is('cordova')) {
            //Función si estamos en un dispositivo para subscribirnos a los 
            // eventos on connect y disconnect de la red de internet
            this.network.onConnect().subscribe(() => {
                // console.log('network was connected :-)');
                this.hasConnection.next(true);
                return;
            });
            this.network.onDisconnect().subscribe(() => {
                // console.log('network was disconnected :-(');
                this.hasConnection.next(false);
                return;
            });
        } else {
            //Función si estamos en un navegador para subscribirnos a los 
            // eventos on connect y disconnect de la red de internet
            this.online = merge(
                of(navigator.onLine),
                fromEvent(window, 'online').pipe(mapTo(true)),
                fromEvent(window, 'offline').pipe(mapTo(false))
            );
            this.online.subscribe((isOnline) => {
                if (isOnline) {
                    this.hasConnection.next(true);
                    // console.log('network was connected :-)');
                } else {
                    // console.log('network was disconnected :-(');
                    this.hasConnection.next(false);
                }
            });
        }
        //Realizar una prueba de conección
        //this.testNetworkConnection();
    }
    //Función obtener el tipo de red a la que estamos conectados
    public getNetworkType(): string {
        return this.network.type;
    }
    // Función obtener el estado de la red
    public getNetworkStatus(): Observable<boolean> {
        return this.hasConnection.asObservable();
    }
    // Función para hacer una petición a JSON Placeholder
    private getNetworkTestRequest(): Observable<any> {
        return this.httpRequest.get('https://jsonplaceholder.typicode.com/todos/1');
    }
    // Función para hace una peticion a una url y comprobar si fue exitosa o no
    public async testNetworkConnection() {
        try {
            this.getNetworkTestRequest().subscribe(
                success => {
                    this.hasConnection.next(true);
                    return;
                }, error => {
                    this.hasConnection.next(false);
                    return;
                });            
        } catch (err) {
            // console.log('err testNetworkConnection', err);
            this.hasConnection.next(false);
            return;
        }
    }
}
