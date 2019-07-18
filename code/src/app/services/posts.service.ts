import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IEmergencyPost, ISocialProblemPost } from '../interfaces/barrios';

@Injectable({
    providedIn: 'root'
})
export class PostsService {

    constructor(
        private http: HttpClient
    ) { }


    sendEmergencyReport(userToken: string, emergencyPost: IEmergencyPost): Observable<any> {
        return this.http.post('url_post_emergency_App', {}, {
            headers: {}
        });
    }

    sendSocialProblemReport(userToken: string, socialProblemPost: ISocialProblemPost): Observable<any> {
        return this.http.post('url_post_emergency_App', {}, {
            headers: {}
        });
    }

    getSocialProblems(): Observable<any> {
        return this.http.get('assets/data/socialProblems.json');
    }

    getEvents(): Observable<any> {
        return this.http.get('assets/data/events.json');
    }

    getSocialProblem(id: number): Observable<any> {
        return this.http.get('assets/data/socialProblems.json');
    }

    getEvent(id: number): Observable<any> {
        return this.http.get('assets/data/events.json');
    }


}
