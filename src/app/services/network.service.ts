import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network/ngx';
import { Platform } from '@ionic/angular';
import { Observable, fromEvent, merge, of, BehaviorSubject } from 'rxjs';
import { mapTo } from "rxjs/operators";
import { HttpClient } from '@angular/common/http';


@Injectable({
    providedIn: 'root'
})
export class NetworkService {

    private online: Observable<boolean> = null;
    private hasConnection = new BehaviorSubject(false);

    constructor(
        private network: Network,
        private platform: Platform,
        private httpClient: HttpClient) {

        if (this.platform.is('cordova')) {
            //Función si estamos en un dispositivo para subscribirnos a los eventos on connect y disconnect de la red de internet
            this.network.onConnect().subscribe(() => {
                this.hasConnection.next(true);
                return;
            });
            this.network.onDisconnect().subscribe(() => {
                this.hasConnection.next(false);
                return;
            });
        } else {
            //Función si estamos en un navegador para subscribirnos a los eventos onconnect y disconnect de la red de internet
            this.online = merge(
                of(navigator.onLine),
                fromEvent(window, 'online').pipe(mapTo(true)),
                fromEvent(window, 'offline').pipe(mapTo(false))
            );
            this.online.subscribe((isOnline) => {
                if (isOnline) {
                    this.hasConnection.next(true);
                } else {
                    this.hasConnection.next(false);
                }
            });
        }
    }
    //Función obtener el tipo de red a la que estamos conectados
    public getNetworkType(): string {
        return this.network.type;
    }
    // Función obtener el estado de la red
    public getNetworkStatus(): Observable<boolean> {
        return this.hasConnection.asObservable();
    }
    // Funcion obtener subject de la red
    public getNetworkValue() {
        return this.hasConnection.value;
    }
    // Función para hacer una petición a JSON Placeholder
    private getNetworkTestRequest(): Observable<any> {
        return this.httpClient.get('https://jsonplaceholder.typicode.com/todos/1');
    }
    // Función para hace una peticion a una url y comprobar si fue exitosa o no
    public async testNetworkConnection() {
        this.getNetworkTestRequest().subscribe(
            () => {
                this.hasConnection.next(true);
                return;
            }, () => {
                this.hasConnection.next(false);
                return;
            });

    }
}
