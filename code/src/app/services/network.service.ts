import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network/ngx';
import { Platform } from '@ionic/angular';
import { Observable, fromEvent, merge, of, BehaviorSubject } from 'rxjs';
import { mapTo, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';


@Injectable({
    providedIn: 'root'
})
export class NetworkService {

    // private online: Observable<boolean> = null;
    private hasConnection = new BehaviorSubject(false);

    constructor(
        private network: Network,
        private platform: Platform,
        private http: HttpClient) {

        // this.online = new Observable(observer => {
        //     observer.next(false);
        // }).pipe(mapTo(false));

        if (this.platform.is('cordova')) {
            // on Device
            this.network.onConnect().subscribe(() => {
                console.log('network was connected :-)');
                this.hasConnection.next(true);
                return;
            });
            this.network.onDisconnect().subscribe(() => {
                console.log('network was disconnected :-(');
                this.hasConnection.next(false);
                // this.online = new Observable(observer => {
                //     observer.next(false);
                // }).pipe(mapTo(false));
                return;
            });
            // this.online = merge(
            //     this.network.onConnect()
            //         .pipe(mapTo(true), map(status => {
            //         console.log('Evento encendi acceso a internet');
            //         return true;
            //     })),
            //     this.network.onDisconnect().pipe(mapTo(false), map(status => {
            //         console.log('Evento encendi acceso a internet');
            //         return false;
            //     })));
            // this.network.onConnect().pipe(
            //    map(status => return )
            // )
        } else {
            // on Browser
            // this.online = merge(of(navigator.onLine),
            //     fromEvent(window, 'online').pipe(mapTo(true), map(status => {
            //         console.log('Evento encendi acceso a internet');
            //         return true;
            //     })),
            //     fromEvent(window, 'offline').pipe(mapTo(false), map(status => {
            //         console.log('Evento apague acceso a internet');
            //         return false;
            //     }))
            // );
        }
        this.testNetworkConnection();
    }

    public getNetworkType(): string {
        return this.network.type;
    }

    public getNetworkStatus(): Observable<boolean> {
        // return this.online;
        return this.hasConnection.asObservable();
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
                // this.online = new Observable(observer => {
                //     observer.next(true);
                // }).pipe(mapTo(true));
                return;
            }, error => {
                // console.log('Request to Google Test fails', error);
                this.hasConnection.next(false);
                // this.online = new Observable(observer => {
                //     observer.next(false);
                // }).pipe(mapTo(false));
                return;
            });
        } catch (err) {
            console.log('err testNetworkConnection', err);
            this.hasConnection.next(false);
            return;
       }
    }

    // getNetworkTestValue() {
    //     return this.hasConnection.value;
    // }

}
