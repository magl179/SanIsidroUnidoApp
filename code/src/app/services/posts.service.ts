import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IEmergencyPost, ISocialProblemPost } from '../interfaces/barrios';
import { environment } from 'src/environments/environment';
import { IEmergencyReported, ISocialProblemReported } from 'src/app/interfaces/models';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class PostsService implements OnInit {

    //DatosUsuario
    AuthUser = null;
    AuthToken = null;
    //Cabeceras
    headersApp = new HttpHeaders({
        'Content-Type': 'application/json'
    });
    //Paginas Actuales
    currentPage = {
        events: 0,
        socialProblems: 0
    }
    //Categorias Actuales
    currentCategory = {
        socialProblem: ''
    }
    socialProblemsCurrentSubcategory = '';
    socialProblemsSubcategoriesPage = 0;
    // categoriesPostsPagesNumber = 0;

    constructor(
        private http: HttpClient,
        private authService: AuthService
    ) { }

    resetSocialProblemsPage() {
        this.currentPage.socialProblems = 0;
    }
    resetEventsPage() {
        this.currentPage.events = 0;
    }
    async ngOnInit() {
        this.authService.getAuthToken().subscribe(token => {
            this.AuthToken = token;
        });
        this.authService.getAuthUser().subscribe(user => {
            this.AuthUser = user;
        });
        // this.AuthToken = await this.auth.getToken();
        // this.AuthUser = await this.auth.getCurrentUser();
    }
    //MÉTODOS POST
    sendEmergencyReport(emergencyPost: IEmergencyReported): Observable<any> {
        const headers = this.headersApp.set('Authorization', this.AuthToken);
        return this.http.post(`${environment.apiBaseURL}/emergencias`, emergencyPost, {
            headers
        });
    }

    sendSocialProblemReport(socialProblemPost: ISocialProblemReported): Observable<any> {
        const headers = this.headersApp.set('Authorization', this.AuthToken);
        return this.http.post(`${environment.apiBaseURL}/problemas-sociales`, socialProblemPost, {
            headers
        });
    }
    // MÉTODOS GET
    getSocialProblemsTest(): Observable<any> {
        return this.http.get(`assets/data/socialProblems.json`);
    }

    getSocialProblems(): Observable<any> {
        this.currentPage.socialProblems++;
        console.log('Social Problems Page', this.currentPage.socialProblems);
        return this.http.get(`${environment.apiBaseURL}/problemas-sociales?page=${this.currentPage.socialProblems}`);
    }

    getEventsTest(): Observable<any> {
        return this.http.get('assets/data/events.json');
    }
    getEvents(): Observable<any> {
        this.currentPage.events++;
        console.log('Events Page', this.currentPage.events);
        return this.http.get(`${environment.apiBaseURL}/eventos?page=${this.currentPage.events}`);
    }

    getSocialProblem(id: number): Observable<any> {
        return this.http.get(`${environment.apiBaseURL}/problemas-sociales/${id}`);
    }

    getEvent(id: number): Observable<any> {
        return this.http.get(`${environment.apiBaseURL}/eventos/${id}`);
    }

    getPublicServices(): Observable<any> {
        return this.http.get(`${environment.apiBaseURL}/servicios-publicos`);
    }

    getSubcategoriesByCategory(category: string): Observable<any> {
        const url = `${environment.apiBaseURL}/categorias/${category}/subcategorias`;
        return this.http.get(url);
    }

}
