import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network/ngx';
import { Platform } from '@ionic/angular';
import { Observable, fromEvent, merge, of, BehaviorSubject } from 'rxjs';
import { mapTo } from 'rxjs/operators';
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
        private http: HttpClient) {

        this.online = new Observable(observer => {
            observer.next(true);
        }).pipe(mapTo(true));

        if (this.platform.is('cordova')) {
            // on Device
            this.online = merge(
                this.network.onConnect().pipe(mapTo(true)),
                this.network.onDisconnect().pipe(mapTo(false)));
        } else {
            // on Browser
            this.online = merge(of(navigator.onLine),
                fromEvent(window, 'online').pipe(mapTo(true)),
                fromEvent(window, 'offline').pipe(mapTo(false))
            );
        }
        this.testNetworkConnection();
    }

    public getNetworkType(): string {
        return this.network.type;
    }

    public getNetworkStatus(): Observable<boolean> {
        return this.online;
    }

    private getNetworkTestRequest(): Observable<any> {
        return this.http.get('https://jsonplaceholder.typicode.com/todos/1');
    }

    public async testNetworkConnection() {
        try {
            this.getNetworkTestRequest().subscribe(
            success => {
                // console.log('Request to Google Test  success', success);
                this.hasConnection.next(true);
                return;
            }, error => {
                // console.log('Request to Google Test fails', error);
                this.hasConnection.next(false);
                return;
            });
        } catch (err) {
            console.log('err testNetworkConnection', err);
       }
    }

    getNetworkTestValue() {
        return this.hasConnection.value;
    }

}
