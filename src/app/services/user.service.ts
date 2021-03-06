import { Injectable, OnInit } from '@angular/core';;
import { Observable, of, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';
import { CONFIG } from 'src/config/config';
import { IEditProfile } from 'src/app/interfaces/models';
import { IDeviceUser } from 'src/app/interfaces/models';
import { HttpRequestService } from "./http-request.service";
import { setHeaders, cleanEmpty } from 'src/app/helpers/utils';
import { pluck, map, catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorService } from './error.service';

@Injectable({
    providedIn: 'root'
})
export class UserService implements OnInit {

    AuthUser = null;
    AuthToken = null;

    public PaginationKeys = {
        NOTIFICATIONS: 'notifications',
    }

    private currentPagination = {
        notifications: 0
    }

    constructor(
        private httpRequest: HttpRequestService,
        private authService: AuthService,
        private errorService: ErrorService
    ) {
        this.authService.sessionAuthToken.subscribe(token => {
            this.AuthToken = (token) ? token : null;
        });
        this.authService.sessionAuthUser.subscribe(res => {
            this.AuthUser = (res) ? res.user: null;
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

    getProfile(){
        const user_id = this.AuthUser.id;
        const headers = setHeaders(CONFIG.AUTHORIZATION_NAME, this.AuthToken);
        return this.httpRequest.get(`${environment.APIBASEURL}/usuarios/${user_id}?roles`, {}, headers);
    }

    //Obtener la información de un usuario
    getUserInfo(id: number): Observable<any> {
        const headers = setHeaders(CONFIG.AUTHORIZATION_NAME, this.AuthToken);
        return this.httpRequest.get(`${environment.APIBASEURL}/usuarios/${id}`, {}, headers);
    }
    // Obtener las notificaciones de un usuario
    getNotificationsUser(params = {}) {
        const headers = setHeaders(CONFIG.AUTHORIZATION_NAME, this.AuthToken);
        const user_id = this.AuthUser.id;
        this.increasePagination(this.PaginationKeys.NOTIFICATIONS);
        const withoutEmptyParams = cleanEmpty(params);
        return this.httpRequest.get(`${environment.APIBASEURL}/usuarios/${user_id}/notificaciones`, {
            page: this.getPagination(this.PaginationKeys.NOTIFICATIONS),
            ...withoutEmptyParams
        }, headers);
    }
    // Obtener los dispositivos de un usuario
    getSocialProfilesUser() {
        const user_id = this.AuthUser.id;
        const headers = setHeaders(CONFIG.AUTHORIZATION_NAME, this.AuthToken);
        return this.httpRequest.get(`${environment.APIBASEURL}/usuarios/${user_id}/perfiles-sociales`, {}, headers)
        .pipe(
            pluck('data'),
            catchError((error_http: HttpErrorResponse) => {
                this.errorService.manageHttpError(error_http, 'Ocurrio un error al obtener tus perfiles sociales');
                return of([]);
            }),
        );
    }

    getMembershipsByUser(user_id) {
        const headers = setHeaders(CONFIG.AUTHORIZATION_NAME, this.AuthToken);
        return this.httpRequest.get(`${environment.APIBASEURL}/usuarios/${user_id}/membresias`, {}, headers);
    }

    getDevicesUser() {
        const user_id = this.AuthUser.id;
        const headers = setHeaders(CONFIG.AUTHORIZATION_NAME, this.AuthToken);
        return this.httpRequest.get(`${environment.APIBASEURL}/usuarios/${user_id}/dispositivos`, {}, headers)
        .pipe(
            pluck('data'),
            catchError((error_http: HttpErrorResponse) => {
                this.errorService.manageHttpError(error_http, 'Ocurrio un error al obtener tus dispositivos asociados');
                return of([]);
            }),
        );
    }
    //Enviar una solicitud de cambio de contraseña
    sendChangeUserPassRequest(newPassword: string): Observable<any> {
        const headers = setHeaders(CONFIG.AUTHORIZATION_NAME, this.AuthToken);
        return this.httpRequest.patch(`${environment.APIBASEURL}/usuarios/cambiar-contrasenia`, {
            password: newPassword,
            password_confirmation: newPassword
        }, headers );
    }
    // Enviar una solicitud para cambiar el avatar de un usuario
    sendChangeUserImageRequest(image: string): Observable<any> {
        const headers = setHeaders(CONFIG.AUTHORIZATION_NAME, this.AuthToken);
        return this.httpRequest.post(`${environment.APIBASEURL}/usuarios/cambiar-avatar`, {
            avatar: image
        }, headers);
    }
    // Enviar una solicitud para editar los datos de perfil de un usuario
    sendEditProfileRequest(profile: IEditProfile): Observable<any> {
        const headers = setHeaders(CONFIG.AUTHORIZATION_NAME, this.AuthToken);
        return this.httpRequest.patch(`${environment.APIBASEURL}/usuarios/editar`, profile, headers);
    }
    // Enviar solicitud de afiliacion al barrio
    sendRequestUserMembership(requestObj: {}) {
        const headers = setHeaders(CONFIG.AUTHORIZATION_NAME, this.AuthToken);     
        return this.httpRequest.post(`${environment.APIBASEURL}/usuarios/solicitar-afiliacion`,requestObj, headers );
    }
    // Enviar solicitud par agregar dispositivo asociado a un usuario
    sendRequestAddUserDevice(device: IDeviceUser) {
        const headers = setHeaders(CONFIG.AUTHORIZATION_NAME, this.AuthToken);
        return this.httpRequest.post(`${environment.APIBASEURL}/usuarios/dispositivos`, device, headers);
    }
    // Enviar solicitud para eliminar dispositivo asociado a un usuario
    sendRequestDeleteUserDevice(device_id: number) {
        const headers = setHeaders(CONFIG.AUTHORIZATION_NAME, this.AuthToken);
        return this.httpRequest.delete(`${environment.APIBASEURL}/usuarios/dispositivos/${device_id}`, {}, headers );
    }
    //Enviar solicitud para eliminar un perfil social de un usuario
    sendRequestDeleteSocialProfile(social_profile_id: number) {
        const headers = setHeaders(CONFIG.AUTHORIZATION_NAME, this.AuthToken);
        return this.httpRequest.delete(`${environment.APIBASEURL}/usuarios/perfiles-sociales/${social_profile_id}`, {}, headers);
    }
    
    //Enviar solicitud para eliminar un perfil social de un usuario
    sendRequestDeleteUserPhoneDevice(phone_id: string) {
        const headers = setHeaders(CONFIG.AUTHORIZATION_NAME, this.AuthToken);
        if(phone_id){
            return this.httpRequest.delete(`${environment.APIBASEURL}/usuarios/dispositivos/logout/${phone_id}`, {}, headers );
        }
        return of(null)
    }

    readNotification(id: number){
        const user_id = this.AuthUser.id;
        const headers = setHeaders(CONFIG.AUTHORIZATION_NAME, this.AuthToken);
        return this.httpRequest.delete(`${environment.APIBASEURL}/usuarios/${user_id}/notificaciones`, {
            notification_id: id
        }, headers);
    }
   
}
