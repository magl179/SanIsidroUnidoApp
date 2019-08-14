import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

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

    getDirectives(): Observable<any> {
        return this.http.get(`${environment.apiBaseURL}/directivos`);
    }
}
