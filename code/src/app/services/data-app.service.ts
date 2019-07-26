import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IMenuComponent } from '../interfaces/barrios';

@Injectable({
    providedIn: 'root'
})
export class DataAppService {

    constructor(
        private http: HttpClient
    ) { }

    getMenuOptions() {
        return this.http.get<IMenuComponent[]>('/assets/data/menu.json');
    }

    getDirectivaData() {
        return this.http.get<any>('url_to_api_to_get_directiva_data.json');
    }

    getPublicServicesData() {
        return this.http.get<any>('url_to_api_to_get_public_services_data.json');
    }

    getHomeOptions() {
        return this.http.get<any>('/assets/data/home_options.json');
    }

}
