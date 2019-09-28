import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from "@angular/common/http";
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';
import { IEditProfile } from 'src/app/interfaces/models';
import { IPhoneUser } from '../interfaces/models';
import { HttpRequestService } from "./http-request.service";

@Injectable({
    providedIn: 'root'
})
export class UserService implements OnInit {

    AuthUser = null;
    AuthToken = null;

    headersApp = new HttpHeaders({
        'Content-Type': 'application/json'
    });

    constructor(
        private http: HttpClient,
        private httpRequest: HttpRequestService,
        private authService: AuthService
    ) {
        this.authService.getAuthToken().subscribe(token => {
            this.AuthToken = (token) ? token : null;
        });
        this.authService.getAuthUser().subscribe(res => {
            this.AuthUser = (res) ? res.user: null;
        });
    }

    ngOnInit() { }
    //Obtener la información de un usuario
    getUserInfo(id: number): Observable<any> {
        return this.httpRequest.get(`${environment.apiBaseURL}/usuarios/${id}`);
    }
    // Obtener las notificaciones de un usuario
    getNotificationsUser() {
        const user_id = this.AuthUser.id;
        return this.httpRequest.get(`${environment.apiBaseURL}/usuarios/${user_id}/notificaciones`);
    }
    // Obtener los dispositivos de un usuario
    getDevicesUser() {
        // const headers = this.headersApp.set(AUTHORIZATION_NAME, this.AuthToken);
        const user_id = this.AuthUser.id;
        return this.httpRequest.get(`${environment.apiBaseURL}/usuarios/${user_id}/dispositivos`);
    }
    //Enviar una solicitud de cambio de contraseña
    sendChangeUserPassRequest(newPassword: string): Observable<any> {
        const headers = this.headersApp.set(environment.AUTHORIZATION_NAME, this.AuthToken);
        const user_id = this.AuthUser.id;
        return this.httpRequest.patch(`${environment.apiBaseURL}/usuarios/${user_id}/cambiar-contrasenia`, {
            password: newPassword,
            password_confirmation: newPassword
        }, headers );
    }
    // Enviar una solicitud para cambiar el avatar de un usuario
    sendChangeUserImageRequest(image: string): Observable<any> {
        const headers = this.headersApp.set(environment.AUTHORIZATION_NAME, this.AuthToken);
        const user_id = this.AuthUser.id;
        return this.httpRequest.patch(`${environment.apiBaseURL}/usuarios/${user_id}/cambiar-avatar`, {
            avatar: image
        }, headers);
    }
    // Enviar una solicitud para editar los datos de perfil de un usuario
    sendEditProfileRequest(profile: IEditProfile): Observable<any> {
        const headers = this.headersApp.set(environment.AUTHORIZATION_NAME, this.AuthToken);
        const user_id = this.AuthUser.id;
        return this.httpRequest.patch(`${environment.apiBaseURL}/usuarios/${user_id}`, profile, headers);
    }
    // Enviar solicitud de afiliacion al barrio
    sendRequestUserMembership(image: string) {
        const headers = this.headersApp.set(environment.AUTHORIZATION_NAME, this.AuthToken);
        const user_id = this.AuthUser.id;
        return this.httpRequest.patch(`${environment.apiBaseURL}/usuarios/${user_id}/solicitar-afiliacion`, {
            basic_service_image: image
        }, headers );
    }
    // Enviar solicitud par agregar dispositivo asociado a un usuario
    sendRequestAddUserDevice(device: IPhoneUser) {
        const headers = this.headersApp.set(environment.AUTHORIZATION_NAME, this.AuthToken);
        const user_id = this.AuthUser.id;
        return this.httpRequest.post(`${environment.apiBaseURL}/usuarios/${user_id}/dispositivos`, device, headers);
    }
    // Enviar solicitud para eliminar dispositivo asociado a un usuario
    sendRequestDeleteUserDevice(device_id: number) {
        const headers = this.headersApp.set(environment.AUTHORIZATION_NAME, this.AuthToken);
        const user_id = this.AuthUser.id;
        return this.httpRequest.delete(`${environment.apiBaseURL}/usuarios/${user_id}/dispositivos/${device_id}`, {}, headers );
    }
    //Enviar solicitud para eliminar un perfil social de un usuario
    sendRequestDeleteSocialProfile(social_profile_id: number) {
        const headers = this.headersApp.set(environment.AUTHORIZATION_NAME, this.AuthToken);
        const user_id = this.AuthUser.id;
        return this.httpRequest.delete(`${environment.apiBaseURL}/usuarios/${user_id}/perfiles-sociales/${social_profile_id}`, {}, headers );
    }

    
}
