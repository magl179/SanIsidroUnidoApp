import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class DirectivesService {

    constructor(
        private http: HttpClient
    ) { }

    getDirectivesData(): Observable<any> {
        return this.http.get('assets/data/boardMembers.json');
    }
}
