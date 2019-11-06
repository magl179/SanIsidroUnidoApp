import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IEmergencyReported, ISocialProblemReported, ICreateDetail } from 'src/app/interfaces/models';
import { AuthService } from './auth.service';
import { HttpRequestService } from "./http-request.service";
import { IRespuestaApiSIUPaginada } from "src/app/interfaces/models";
import { setHeaders } from 'src/app/helpers/utils';

@Injectable({
    providedIn: 'root'
})
export class PostsService implements OnInit {

    //DatosUsuario
    AuthUser = null;
    AuthToken = null;
    //Paginas Actuales
    currentPage = {
        events: 0,
        socialProblems: 0,
        emergencies: 0,
        reports: 0,
        socialProblemsBySubcategory: 0
    }
    //Categorias Actuales
    currentCategory = {
        socialProblem: ''
    }
    socialProblemsCurrentSubcategory = '';
    socialProblemsSubcategoriesPage = 0;

    constructor(
        private authService: AuthService,
        private httpRequest: HttpRequestService
    ) {
        //Cargar token e Información del Usuario Autenticado
        this.authService.sessionAuthToken.subscribe(token => {
            if (token) {
                this.AuthToken = token;
            }
        });
        this.authService.sessionAuthUser.subscribe(res => {
            if (res) {
                this.AuthUser = res.user;
            }
        });
    }

    ngOnInit() { }

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
    //METODOS POST
    // Función para enviar un Reporte de Emergencia
    sendEmergencyReport(emergencyPost: IEmergencyReported): Observable<any> {
        const headers = setHeaders(environment.AUTHORIZATION_NAME, this.AuthToken);
        return this.httpRequest.post(`${environment.apiBaseURL}/emergencias`, emergencyPost, headers);
    }
    // Función para enviar un Reporte de Problema Social
    sendSocialProblemReport(socialProblemPost: ISocialProblemReported): Observable<any> {
        const headers = setHeaders(environment.AUTHORIZATION_NAME, this.AuthToken);
        return this.httpRequest.post(`${environment.apiBaseURL}/problemas-sociales`, socialProblemPost,headers);
    }
    // Función para Enviar un like o asistencia a registrarse de un post
    sendCreateDetailToPost(detailInfo: ICreateDetail) {
        // const headers = this.headersApp.set(environment.AUTHORIZATION_NAME, this.AuthToken);
        const headers = setHeaders(environment.AUTHORIZATION_NAME, this.AuthToken);
        const url = `${environment.apiBaseURL}/detalles`;
        // const url = `http://localhost:3000/`;
        return this.httpRequest.post(url, detailInfo, headers);
    }
     // Función para Enviar un like o asistencia a eliminarse de un post
    sendDeleteDetailToPost(post_id: number) {
        const headers = setHeaders(environment.AUTHORIZATION_NAME, this.AuthToken);
        headers[environment.AUTHORIZATION_NAME] = this.AuthToken;
        return this.httpRequest.delete(`${environment.apiBaseURL}/detalles/${post_id}`, {}, headers);
    }
    //METODOS GET
    //Función para obtener detalle publicaciones
    getPostDetail(slug: string, id: number) {
        return this.httpRequest.get(`${environment.apiBaseURL}/publicaciones/categoria/${slug}/detalle/${id}`);
    }
    //Función para obtener detalle publicaciones
    getPosts(slug: string, page: number) {
        return this.httpRequest.get(`${environment.apiBaseURL}/publicaciones/categoria/${slug}?page=${page}`);
    }
    // Función para obtener los problemas sociales de la API
    getSocialProblems(): Observable<any> {
        this.currentPage.socialProblems++;
        const socialProblemsSlug = environment.socialProblemSlug;
        return this.getPosts(socialProblemsSlug, this.currentPage.socialProblems);
    }
    // Función para obtener el listado de emergencias reportadas por un usuario
    getEmergenciesByUser() {
        const user_id = this.AuthUser.id;
        this.currentPage.emergencies++;
        return this.httpRequest.get(`${environment.apiBaseURL}/usuarios/${user_id}/emergencias?page=${this.currentPage.emergencies}`);
    }
    // Función para obtener el listado de eventos publicados
    getEvents(): Observable<IRespuestaApiSIUPaginada> {
        this.currentPage.events++;
        const eventsSlug = environment.eventsSlug;
        return this.getPosts(eventsSlug, this.currentPage.events);
    }
    //Funcion para obtener el listado de informes registrados
    getReports(): Observable<IRespuestaApiSIUPaginada>{
        this.currentPage.reports++;
        const reportsSlug = environment.reportsSlug;
        return this.getPosts(reportsSlug, this.currentPage.reports);
    }
    // Función para obtener el detalle de un problema social
    getSocialProblem(id: number): Observable<any> {
        const socialProblemsSlug = environment.socialProblemSlug;
        return this.getPostDetail(socialProblemsSlug, id);
    }
    // Función para obtener el detalle de un evento
    getEvent(id: number): Observable<any> {
        const eventsSlug = environment.eventsSlug;
        return this.getPostDetail(eventsSlug, id);
    }
    // Función para obtener el detalle de una emergencia
    getEmergency(id: number): Observable<any> {
        const emergenciesSlug = environment.emergenciesSlug;
        return this.getPostDetail(emergenciesSlug, id);
    }
    // Función para obtener el detalle de un informe
    getReport(id: number): Observable<any> {
        const reportsSlug = environment.reportsSlug;
        return this.getPostDetail(reportsSlug, id);
    }
    // Función para obtener el listado de subcategorias de una categoria
    getSubcategoriesByCategory(category: string): Observable<any> {
        const url = `${environment.apiBaseURL}/categorias/${category}/subcategorias`;
        return this.httpRequest.get(url);
    }
    getPostsBySubCategory(category: string, subcategory: string) {
        this.currentPage.socialProblemsBySubcategory++;
        const url = `${environment.apiBaseURL}/publicaciones/categoria/${category}/subcategoria/${subcategory}`;
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
