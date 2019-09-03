import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network/ngx';
import { Platform } from '@ionic/angular';
import { Observable, fromEvent, merge, of, BehaviorSubject, from } from 'rxjs';
import { mapTo, finalize } from "rxjs/operators";
import { HttpClient } from '@angular/common/http';
import { HTTP } from '@ionic-native/http/ngx';


@Injectable({
    providedIn: 'root'
})
export class NetworkService {

    private online: Observable<boolean> = null;
    private hasConnection = new BehaviorSubject(false);

    constructor(
        private network: Network,
        private platform: Platform,
        private http: HttpClient,
        private nativeHttp: HTTP) {

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
                return;
            });
        } else {
            // on Browser
            this.online = merge(
                of(navigator.onLine),
                fromEvent(window, 'online').pipe(mapTo(true)),
                fromEvent(window, 'offline').pipe(mapTo(false))
            );

            this.online.subscribe((isOnline) => {
                if (isOnline) {
                    this.hasConnection.next(true);
                    console.log('network was connected :-)');
                } else {
                    console.log('network was disconnected :-(');
                    this.hasConnection.next(false);
                    console.log(isOnline);
                }
            });
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
                    this.hasConnection.next(true);
                    return;
                }, error => {
                    this.hasConnection.next(false);
                    return;
                });
            
            if (this.platform.is('cordova')) {     
                from(this.nativeHttp.post('http://127.0.0.1/github/SanIsidroWeb/public/api/v1/usuarios/5/cambiar-avatar', {
                    avatar: 'data://base64'
                }, { 'Content-Type': 'application/json' })).pipe(
                    finalize(() => {
                        console.log('Native Test Finalized');
                    })
                ).subscribe(data => {
                    console.log('test native success');
                }, err => {
                    console.log('Native Call test error: ', err);
                });
            }
            
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
