import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HTTP } from '@ionic-native/http/ngx';
import { Observable, from } from 'rxjs';
import { IEmergencyPost, ISocialProblemPost } from '../interfaces/barrios';
import { environment } from 'src/environments/environment';
import { IEmergencyReported, ISocialProblemReported, ICreateDetail } from 'src/app/interfaces/models';
import { AuthService } from './auth.service';
import { HttpRequestService } from "./http-request.service";

const AUTHORIZATION_NAME = "authorization";

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
        socialProblems: 0,
        emergencies: 0,
        reports: 0
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
        private nativeHttp: HTTP,
        private authService: AuthService,
        private httpRequest: HttpRequestService
    ) {
        //Cargar token e Información del Usuario Autenticado
        this.authService.getAuthToken().subscribe(token => {
            if (token) {
                this.AuthToken = token;
            }
        });
        this.authService.getAuthUser().subscribe(res => {
            if (res) {
                this.AuthUser = res.user;
            }
        });
    }

    ngOnInit() { }

    test() {
        const test = from(this.nativeHttp.get(`${environment.apiBaseURL}/servicios-publicos`, {}, {}));
        test.subscribe(res => {
            console.log('success', res);
        }, err => {
            console.log('Error', err);
        });
    }
    //MÉTODOS PARA RESETEAR LOS CONTADORES DE PAGINACION
    resetSocialProblemsPage() {
        this.currentPage.socialProblems = 0;
    }
    resetEventsPage() {
        this.currentPage.events = 0;
    }
    resetEmergenciesPage() {
        this.currentPage.emergencies = 0;
    }
    resetReportsPage() {
        this.currentPage.reports = 0;
    }
    // Función para enviar un Reporte de Emergencia
    sendEmergencyReport(emergencyPost: IEmergencyReported): Observable<any> {
        emergencyPost.user_id = this.AuthUser.id;
        const headers = this.headersApp.set(AUTHORIZATION_NAME, this.AuthToken);
        return this.httpRequest.post(`${environment.apiBaseURL}/emergencias`, emergencyPost, headers);
    }
    // Función para enviar un Reporte de Problema Social
    sendSocialProblemReport(socialProblemPost: ISocialProblemReported): Observable<any> {
        socialProblemPost.user_id = this.AuthUser.id;
        const headers = this.headersApp.set(AUTHORIZATION_NAME, this.AuthToken);
        return this.httpRequest.post(`${environment.apiBaseURL}/problemas-sociales`, socialProblemPost,headers);
    }
    // Función para Enviar un like o asistencia a registrarse de un post
    sendCreateDetailToPost(detailInfo: ICreateDetail) {
        const headers = this.headersApp.set(AUTHORIZATION_NAME, this.AuthToken);
        return this.httpRequest.post(`${environment.apiBaseURL}/detalles`, detailInfo, headers);
    }
     // Función para Enviar un like o asistencia a eliminarse de un post
    sendDeleteDetailToPost(post_id: number) {
        const headers = this.headersApp.set(AUTHORIZATION_NAME, this.AuthToken);
        // console.log('auth token', this.AuthToken);
        return this.httpRequest.delete(`${environment.apiBaseURL}/detalles/${post_id}`, {}, headers);
    }
    // Función para obtener los problemas sociales de la API
    getSocialProblems(): Observable<any> {
        this.currentPage.socialProblems++;
        return this.httpRequest.get(`${environment.apiBaseURL}/problemas-sociales?page=${this.currentPage.socialProblems}`);
    }
    // Función para obtener el listado de emergencias reportadas por un usuario
    getEmergenciesByUser() {
        const user_id = this.AuthUser.id;
        this.currentPage.emergencies++;
        return this.httpRequest.get(`${environment.apiBaseURL}/usuarios/${user_id}/emergencias?page=${this.currentPage.emergencies}`);
    }
    // Función para obtener el listado de eventos publicados
    getEvents(): Observable<any> {
        this.currentPage.events++;
        // console.log('Events Page', this.currentPage.events);
        return this.httpRequest.get(`${environment.apiBaseURL}/eventos?page=${this.currentPage.events}`);
    }
    // Función para obtener el detalle de un problema social
    getSocialProblem(id: number): Observable<any> {
        return this.httpRequest.get(`${environment.apiBaseURL}/problemas-sociales/${id}`);
    }
    // Función para obtener el detalle de un evento
    getEvent(id: number): Observable<any> {
        return this.httpRequest.get(`${environment.apiBaseURL}/eventos/${id}`);
    }
    // Función para obtener el detalle de una emergencia
    getEmergency(id: number): Observable<any> {
        return this.httpRequest.get(`${environment.apiBaseURL}/emergencias/${id}`);
    }
    // Función para obtener el listado de servicios publicos registrados
    getPublicServices(): Observable<any> {
        return this.httpRequest.get(`${environment.apiBaseURL}/servicios-publicos`);
    }
    // Función para obtener el listado de subcategorias de una categoria
    getSubcategoriesByCategory(category: string): Observable<any> {
        const url = `${environment.apiBaseURL}/categorias/${category}/subcategorias`;
        return this.httpRequest.get(url);
    }
    // Función para buscar las publicaciones relacionadas a una categoria de una busqueda en especifico
    searchPosts(search_term: string, slugCategory: string) {
        const url = `${environment.apiBaseURL}/search/${slugCategory}?search_term=${search_term}`;
        return this.httpRequest.get(url);
    }
    // Función para filtrar las publicaciones de acuerdo a unos parametros
    filterPosts(filter_params: object , slugCategory: string) {
        const url = `${environment.apiBaseURL}/filter/${slugCategory}`;
        return this.httpRequest.get(url, filter_params);
    }
}
