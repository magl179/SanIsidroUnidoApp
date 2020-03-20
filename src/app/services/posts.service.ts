import { Injectable, OnInit } from '@angular/core';
import { CONFIG } from 'src/config/config';
import { Observable } from 'rxjs';
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
        //Cargar Token del Usuario Autenticado
        this.authService.sessionAuthToken.subscribe(token => {
            if (token) {
                this.AuthToken = token;
            }
        });
        //Cargar Información del Usuario Autenticado
        this.authService.sessionAuthUser.subscribe(res => {
            if (res) {
                this.AuthUser = res.user;
            }
        });
    }

    ngOnInit() { }

    //MÉTODOS PARA RESETEAR LOS CONTADORES DE PAGINACION
    resetSocialProblemsPage(page=0) {
        this.currentPage.socialProblems = page;
    }
    resetSocialProblemsBySubcategoryPage(page=0) {
        this.currentPage.socialProblemsBySubcategory = page;
    }
    resetEventsPage(page=0) {
        this.currentPage.events = page;
    }
    resetEmergenciesPage(page = 0) {
        this.currentPage.emergencies = page;
    }
    resetReportsPage(page = 0) {
        this.currentPage.reports = page;
    }
    //METODOS POST
    // Función para enviar un Reporte de Emergencia
    sendEmergencyReport(emergencyPost: IEmergencyReported): Observable<any> {
        const headers = setHeaders(CONFIG.AUTHORIZATION_NAME, this.AuthToken);
        return this.httpRequest.post(`${environment.APIBASEURL}/emergencias`, emergencyPost, headers);
    }
    // Función para enviar una accion atender emergencia
    sendPoliciaAtenderEmergencia(emergency_attended_data: any): Observable<any> {
        const headers = setHeaders(CONFIG.AUTHORIZATION_NAME, this.AuthToken);
        return this.httpRequest.post(`${environment.APIBASEURL}/emergencias/atender`, emergency_attended_data, headers);
    }
    // Función para enviar un Reporte de Problema Social
    sendSocialProblemReport(socialProblemPost: ISocialProblemReported): Observable<any> {
        const headers = setHeaders(CONFIG.AUTHORIZATION_NAME, this.AuthToken);
        return this.httpRequest.post(`${environment.APIBASEURL}/problemas-sociales`, socialProblemPost,headers);
    }
    // Función para Enviar un like o asistencia a registrarse de un post
    sendCreateDetailToPost(detailInfo: ICreateDetail) {
        // const headers = this.headersApp.set(environment.AUTHORIZATION_NAME, this.AuthToken);
        const headers = setHeaders(CONFIG.AUTHORIZATION_NAME, this.AuthToken);
        const url = `${environment.APIBASEURL}/detalles`;
        // const url = `http://localhost:3000/`;
        return this.httpRequest.post(url, detailInfo, headers);
    }
     // Función para Enviar un like o asistencia a eliminarse de un post
    sendDeleteDetailToPost(post_id: number) {
        const headers = setHeaders(CONFIG.AUTHORIZATION_NAME, this.AuthToken);
        headers[CONFIG.AUTHORIZATION_NAME] = this.AuthToken;
        return this.httpRequest.delete(`${environment.APIBASEURL}/detalles/${post_id}`, {}, headers);
    }
    //METODOS GET
    //Función para obtener detalle publicaciones
    getPostDetail(slug: string, id: number) {
        return this.httpRequest.get(`${environment.APIBASEURL}/publicaciones/${id}`);
    }
    //Función para obtener detalle publicaciones
    getPosts(slug: string, page: number) {
        const params = {
            "category": slug,
            "page": page
        };
        return this.httpRequest.get(`${environment.APIBASEURL}/publicaciones`, params);
    }
    // Función para obtener los problemas sociales de la API
    getSocialProblems(): Observable<any> {
        this.currentPage.socialProblems++;
        const socialProblemsSlug = CONFIG.SOCIAL_PROBLEMS_SLUG;
        return this.getPosts(socialProblemsSlug, this.currentPage.socialProblems);
    }
    // Función para obtener el listado de emergencias reportadas por un usuario
    getEmergenciesByUser() {
        const user_id = this.AuthUser.id;
        this.currentPage.emergencies++;
        return this.httpRequest.get(`${environment.APIBASEURL}/usuarios/${user_id}/emergencias?page=${this.currentPage.emergencies}`);
    }
    // Función para obtener el listado de eventos publicados
    getEvents(): Observable<IRespuestaApiSIUPaginada> {
        this.currentPage.events++;
        const eventsSlug = CONFIG.EVENTS_SLUG;
        return this.getPosts(eventsSlug, this.currentPage.events);
    }
    //Funcion para obtener el listado de informes registrados
    getReports(): Observable<IRespuestaApiSIUPaginada>{
        this.currentPage.reports++;
        const reportsSlug = CONFIG.REPORTS_SLUG;
        return this.getPosts(reportsSlug, this.currentPage.reports);
    }
    // Función para obtener el detalle de un problema social
    getSocialProblem(id: number): Observable<any> {
        const socialProblemsSlug = CONFIG.SOCIAL_PROBLEMS_SLUG;
        return this.getPostDetail(socialProblemsSlug, id);
    }
    // Función para obtener el detalle de un evento
    getEvent(id: number): Observable<any> {
        const eventsSlug = CONFIG.EVENTS_SLUG;
        return this.getPostDetail(eventsSlug, id);
    }
    // Función para obtener el detalle de una emergencia
    getEmergency(id: number): Observable<any> {
        const emergenciesSlug = CONFIG.EMERGENCIES_SLUG;
        return this.getPostDetail(emergenciesSlug, id);
    }
    // Función para obtener el detalle de un informe
    getReport(id: number): Observable<any> {
        const reportsSlug = CONFIG.REPORTS_SLUG;
        return this.getPostDetail(reportsSlug, id);
    }
    // Función para obtener el listado de subcategorias de una categoria
    getSubcategoriesByCategory(category: string): Observable<any> {
        const url = `${environment.APIBASEURL}/categorias/${category}/subcategorias`;
        return this.httpRequest.get(url);
    }
    getPostsBySubCategory(category: string, subcategory: string) {
        this.currentPage.socialProblemsBySubcategory++;
        const params = {
            "category": category,
            "subcategory": subcategory,
            "page": this.currentPage.socialProblemsBySubcategory
        };
        const url = `${environment.APIBASEURL}/publicaciones`;
        return this.httpRequest.get(url, params);
    }
    // Función para buscar las publicaciones relacionadas a una categoria de una busqueda en especifico
    searchPosts(params: object) {
        const url = `${environment.APIBASEURL}/publicaciones`;
        return this.httpRequest.get(url, params);
    }
    // Función para filtrar las publicaciones de acuerdo a unos parametros
    filterPosts(filter_params: object , slugCategory: string) {
        const url = `${environment.APIBASEURL}/filter/${slugCategory}`;
        return this.httpRequest.get(url, filter_params);
    }
}
