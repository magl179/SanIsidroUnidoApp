import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class HttpRequestService {

    useWithNativeHttp = false;

    constructor(
        private http: HttpClient
    ) { }


    get(url: string, params = {}, headers = {}): any {
        return this.http.get<any>(url, {
            headers,
            params
        });
    }

    post(url: string, body = {}, headers = {}, params = {}) {
        return this.http.post(url, body, {
            headers,
            params
        });
    }


    put(url: string, body = {}, headers = {}, params = {}) {
        return this.http.put(url, body, {
            headers,
            params
        });
    }

    patch(url: string, body = {}, headers = {}, params = {}, ) {
        return this.http.patch(url, body, {
            headers,
            params
        });
    }

    delete(url: string, params = {}, headers = {}) {
        return this.http.delete(url, {
            headers,
            params
        });
    }
}
