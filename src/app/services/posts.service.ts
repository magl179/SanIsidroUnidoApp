import { Injectable, OnInit } from '@angular/core';
import { CONFIG } from 'src/config/config';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IEmergencyReported, ISocialProblemReported, ICreateDetail, IEmergenciaRechazar, IEmergenciaAtender } from 'src/app/interfaces/models';
import { AuthService } from './auth.service';
import { HttpRequestService } from "./http-request.service";
import { IRespuestaApiSIUPaginada } from "src/app/interfaces/models";
import { setHeaders, cleanEmpty } from 'src/app/helpers/utils';
import { tap } from 'rxjs/operators';



@Injectable({
    providedIn: 'root'
})
export class PostsService implements OnInit {

    //DatosUsuario
    private AuthUser = null;
    private AuthToken = null;
    public PaginationKeys = {
        EVENTS: 'events',
        SOCIAL_PROBLEMS: 'socialProblems',
        EMERGENCIES: 'emergencies',
        REPORTS: 'reports',
        SOCIAL_PROBLEMS_BY_SUBCATEGORY: 'socialProblemsBySubcategory',
        EVENTS_BY_SUBCATEGORY: 'socialProblemsBySubcategory'
    }
    //Paginas Actuales
    private currentPagination = {
        events: 0,
        socialProblems: 0,
        emergencies: 0,
        reports: 0,
        socialProblemsBySubcategory: 0,
        eventsBySubcategory: 0
    }

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
    //Metodos Increase Pagination
    resetPagination(type: string, page = 0) {
        this.currentPagination[type] = page;
    }
    resetPaginationEmpty(type: string){
        let oldValue = this.currentPagination[type];
        if(oldValue <= 1) {
            oldValue = 0;
        }else{
            oldValue = oldValue-1;
        }
        this.currentPagination[type] = oldValue;
        return;
    }

    increasePagination(type: string) {
        let oldPage = this.currentPagination[type];
        this.currentPagination[type] = oldPage + 1;
    }
    decrementPagination(type: string) {
        let oldPage = this.currentPagination[type];
        this.currentPagination[type] = oldPage - 1;
    }
    getPagination(type: string) {
        const temp = { ...this.currentPagination };
        return temp[type];
    }
    getAllPagination() {
        return { ...this.currentPagination };
    }
    //METODOS POST
    // Función para enviar un Reporte de Emergencia
    sendEmergencyReport(emergencyPost: IEmergencyReported): Observable<any> {
        const headers = setHeaders(CONFIG.AUTHORIZATION_NAME, this.AuthToken);
        return this.httpRequest.post(`${environment.APIBASEURL}/emergencias`, emergencyPost, headers);
    }
    // Función para enviar una accion atender emergencia
    sendPoliciaAtenderEmergencia(emergency_attended_data: IEmergenciaAtender): Observable<any> {
        const headers = setHeaders(CONFIG.AUTHORIZATION_NAME, this.AuthToken);
        return this.httpRequest.post(`${environment.APIBASEURL}/emergencias/atender`, emergency_attended_data, headers);
    }
    sendPoliciaRechazarEmergencia(emergency_rechazed_data: IEmergenciaRechazar){
        const headers = setHeaders(CONFIG.AUTHORIZATION_NAME, this.AuthToken);
        return this.httpRequest.post(`${environment.APIBASEURL}/emergencias/rechazar`, emergency_rechazed_data, headers);
    }
    // Función para enviar un Reporte de Problema Social
    sendSocialProblemReport(socialProblemPost: ISocialProblemReported): Observable<any> {
        const headers = setHeaders(CONFIG.AUTHORIZATION_NAME, this.AuthToken);
        return this.httpRequest.post(`${environment.APIBASEURL}/problemas-sociales`, socialProblemPost, headers);
    }
    // Función para Enviar un like o asistencia a registrarse de un post
    sendCreateDetailToPost(detailInfo: ICreateDetail) {
        const headers = setHeaders(CONFIG.AUTHORIZATION_NAME, this.AuthToken);
        const url = `${environment.APIBASEURL}/detalles`;
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
    getPostDetail(id: number, params={}) {
        return this.httpRequest.get(`${environment.APIBASEURL}/publicaciones/${id}`, params);
    }
    //Función para obtener detalle publicaciones
    getApiPosts(params: Object) {
        return this.httpRequest.get(`${environment.APIBASEURL}/publicaciones`, params)
    }
    getPosts(slug: string, key: string) {
        return this.httpRequest.get(`${environment.APIBASEURL}/publicaciones`, {
            "category": slug,
            "active": 1,
            "page": this.getPagination[key]
        });
    }
    // Función para obtener los problemas sociales de la API
    getSocialProblems(params = {}): Observable<any> {
        this.increasePagination(this.PaginationKeys.SOCIAL_PROBLEMS);
        const socialProblemsSlug = CONFIG.SOCIAL_PROBLEMS_SLUG;
        return this.getPosts(socialProblemsSlug, 'socialProblems');
    }
    // Función para obtener el listado de emergencias reportadas por un usuario
    getEmergenciesByUser(params = {}) {
        this.increasePagination(this.PaginationKeys.EMERGENCIES);
        const user_id = this.AuthUser.id;
        const mergeParams = { user_id, active: 1, page: this.getPagination(this.PaginationKeys.EMERGENCIES), ...params };
        const withoutEmptyParams = cleanEmpty(mergeParams);
        return this.httpRequest.get(`${environment.APIBASEURL}/usuarios/${user_id}/emergencias`, withoutEmptyParams);
    }
    // Función para obtener el listado de eventos publicados
    getEvents(params = {}): Observable<IRespuestaApiSIUPaginada> {
        this.increasePagination(this.PaginationKeys.EVENTS);
        const tempParams = {
            category: CONFIG.EVENTS_SLUG,
            page: this.getPagination(this.PaginationKeys.EVENTS),
            active: 1
        }
        const requestParams = { ...params, ...tempParams };
        return this.httpRequest.get(`${environment.APIBASEURL}/publicaciones`,requestParams)
    }
    // Función para obtener el listado de emergencias publicadas
    getEmergencies(params = {}): Observable<IRespuestaApiSIUPaginada> {
        this.increasePagination(this.PaginationKeys.EMERGENCIES);
        const tempParams = {
            category: CONFIG.EMERGENCIES_SLUG,
            page: this.getPagination(this.PaginationKeys.EMERGENCIES)            
        }
        const requestParams = { ...params, ...tempParams };
        const withoutEmptyParams = cleanEmpty(requestParams);
        return this.httpRequest.get(`${environment.APIBASEURL}/publicaciones`, withoutEmptyParams)
        .pipe(           
        );
    }
    //Funcion para obtener el listado de informes registrados
    getReports(params = {}): Observable<IRespuestaApiSIUPaginada> {
        this.increasePagination(this.PaginationKeys.REPORTS);
        const tempParams = {
            category: CONFIG.REPORTS_SLUG,
            page: this.getPagination(this.PaginationKeys.REPORTS),
            active: 1
        }
        const requestParams = { ...params, ...tempParams };
        return this.httpRequest.get(`${environment.APIBASEURL}/publicaciones`,requestParams)
    }
    // Función para obtener el detalle de un problema social
    getSocialProblem(id: number, params = {}): Observable<any> {
        return this.getPostDetail(id, params);
    }
    // Función para obtener el detalle de un evento
    getEvent(id: number, params = {}): Observable<any> {
        return this.getPostDetail(id, params);
    }
    // Función para obtener el detalle de una emergencia
    getEmergency(id: number, params = {}): Observable<any> {
        return this.getPostDetail(id, params);
    }
    // Función para obtener el detalle de un informe
    getReport(id: number, params = {}): Observable<any> {
        return this.getPostDetail(id, params);
    }
    // Función para obtener el listado de subcategorias de una categoria
    getSubcategoriesByCategory(category: string): Observable<any> {
        const url = `${environment.APIBASEURL}/categorias/${category}/subcategorias`;
        return this.httpRequest.get(url);
    }
    getPostsBySubCategory(category: string, subcategory: string, params={}, pageKey=this.PaginationKeys.SOCIAL_PROBLEMS_BY_SUBCATEGORY) {
        this.increasePagination(this.PaginationKeys.SOCIAL_PROBLEMS_BY_SUBCATEGORY);
        const tempParams = {
            "category": category,
            "subcategory": subcategory,
            'active': 1,
            "page": this.getPagination(pageKey),
        };
        const requestParams = { ...params, ...tempParams };
        const url = `${environment.APIBASEURL}/publicaciones`;
        return this.httpRequest.get(url, requestParams);
    }
    // Función para buscar las publicaciones relacionadas a una categoria de una busqueda en especifico
    searchPosts(search_params: object) {
        const url = `${environment.APIBASEURL}/publicaciones`;
        const withoutEmptyParams = cleanEmpty(search_params);
        return this.httpRequest.get(url, withoutEmptyParams);
    }
    // Función para filtrar las publicaciones de acuerdo a unos parametros
    filterPosts(filter_params: object, slugCategory: string) {
        const url = `${environment.APIBASEURL}/filter/${slugCategory}`;
        return this.httpRequest.get(url, filter_params);
    }
}
