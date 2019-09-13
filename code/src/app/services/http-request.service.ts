import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HTTP } from '@ionic-native/http/ngx';
import { Observable, from } from 'rxjs';
// import { environment } from 'src/environments/environment';
import { Platform } from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class HttpRequestService {

    differenceRequests = false;

    constructor(
        private http: HttpClient,
        private nativeHttp: HTTP,
        private platform: Platform
    ) { }


    get<T>(url: string, params = {}, headers = {}): any{
        let response: any;
        if (this.platform.is('cordova') && this.differenceRequests) {
            response = from(this.nativeHttp.get(url, params, headers));
        } else {
            response = this.http.get<any>(url, {
                headers,
                params
            });
        }
        return <T>response;
    }

    post(url: string, body = {}, headers = {}, params = {}) {
        if (this.platform.is('cordova') && this.differenceRequests) {
            return from(this.nativeHttp.post(url, body, headers));
        } else {
            return this.http.post(url, body, {
                headers,
                params
            });
        }
    }


    put(url: string, body = {}, headers = {}, params = {}) {
        if (this.platform.is('cordova') && this.differenceRequests) {
            return from(this.nativeHttp.put(url, body, headers));
        } else {
            return this.http.put(url, body, {
                headers,
                params
            });
        }
    }

    patch(url: string, body = {}, headers = {}, params = {}, ) {
        if (this.platform.is('cordova') && this.differenceRequests) {
            return from(this.nativeHttp.patch(url, body, headers));
        } else {
            return this.http.patch(url, body, {
                headers,
                params
            });
        }
    }

    delete(url: string, params = {}, headers = {}) {
        if (this.platform.is('cordova') && this.differenceRequests) {
            return from(this.nativeHttp.delete(url, params, headers));
        } else {
            return this.http.delete(url, {
                headers,
                params
            });
        }
    }
}
