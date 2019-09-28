import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HTTP } from '@ionic-native/http/ngx';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
// import { environment } from 'src/environments/environment';
import { Platform } from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class HttpRequestService {

    useWithNativeHttp = false;

    constructor(
        private http: HttpClient,
        private nativeHttp: HTTP,
        private platform: Platform
    ) { }


    get<T>(url: string, params = {}, headers = {}): any{
        let response: any;
        if (this.platform.is('cordova') && this.useWithNativeHttp) {
            let response_native = this.nativeHttp.get(url, params, headers).then((res: any) => res.json());
            response = from(response_native);
        } else {
            response = this.http.get<any>(url, {
                headers,
                params
            });
        }
        return <T>response;
    }

    post(url: string, body = {}, headers = {}, params = {}) {
        if (this.platform.is('cordova') && this.useWithNativeHttp) {
            const response_native = this.nativeHttp.post(url, body, headers).then((res: any) => res.json())
            return from(response_native);
        } else {
            return this.http.post(url, body, {
                headers,
                params
            });
        }
    }


    put(url: string, body = {}, headers = {}, params = {}) {
        if (this.platform.is('cordova') && this.useWithNativeHttp) {
            const response_native = this.nativeHttp.put(url, body, headers).then((res: any) => res.json())
            return from(response_native);
        } else {
            return this.http.put(url, body, {
                headers,
                params
            });
        }
    }

    patch(url: string, body = {}, headers = {}, params = {}, ) {
        if (this.platform.is('cordova') && this.useWithNativeHttp) {
            // return from(this.nativeHttp.patch(url, body, headers));
            const response_native = this.nativeHttp.patch(url, body, headers).then((res: any) => res.json())
            return from(response_native);
        } else {
            return this.http.patch(url, body, {
                headers,
                params
            });
        }
    }

    delete(url: string, params = {}, headers = {}) {
        if (this.platform.is('cordova') && this.useWithNativeHttp) {
            const response_native = this.nativeHttp.delete(url, params, headers).then((res: any) => res.json())
            return from(response_native);
            // return from(this.nativeHttp.delete(url, params, headers));
        } else {
            return this.http.delete(url, {
                headers,
                params
            });
        }
    }
}
