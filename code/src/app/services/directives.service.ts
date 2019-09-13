import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpRequestService } from "./http-request.service";

@Injectable({
    providedIn: 'root'
})
export class DirectivesService {

    constructor(
        // private http: HttpClient,
        private httpRequest: HttpRequestService
    ) { }

    getDirectivesData(): Observable<any> {
        return this.httpRequest.get('assets/data/boardMembers.json');
    }

    getDirectives(): Observable<any> {
        return this.httpRequest.get(`${environment.apiBaseURL}/directivos`);
    }
}
