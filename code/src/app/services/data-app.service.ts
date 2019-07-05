import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MenuComponente } from '../interfaces/barrios';

@Injectable({
    providedIn: 'root'
})
export class DataAppService {

    constructor(
        private http: HttpClient
    ) { }

    getMenuOptions() {
        return this.http.get<MenuComponente[]>('/assets/data/menu.json');
    }
}
