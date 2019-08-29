import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';
import { IEditProfile } from 'src/app/interfaces/models';
import { catchError } from 'rxjs/operators';
import { IPhoneUser } from '../interfaces/models';

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
        private authService: AuthService
    ) {
        this.authService.getAuthToken().subscribe(token => {
            // this.AuthToken = token;
            this.AuthToken = (token) ? token : null;
        });
        this.authService.getAuthUser().subscribe(res => {
            this.AuthUser = (res) ? res.user: null;
        });
    }

    ngOnInit() { }

    getUserInfo(id: number): Observable<any> {
        return this.http.get(`${environment.apiBaseURL}/usuarios/${id}`);
    }

    getNotificationsUser() {
        const user_id = this.AuthUser.id;
        return this.http.get(`${environment.apiBaseURL}/usuarios/${user_id}/notificaciones`);
    }

    getDevicesUser() {
        const user_id = this.AuthUser.id;
        return this.http.get(`${environment.apiBaseURL}/usuarios/${user_id}/dispositivos`);
    }

    sendChangeUserPassRequest(newPassword: string): Observable<any> {
        const headers = this.headersApp.set('Authorization', this.AuthToken);
        const user_id = this.AuthUser.id;
        return this.http.patch(`${environment.apiBaseURL}/usuarios/${user_id}/cambiar-contrasenia`, {
            password: newPassword,
            password_confirmation: newPassword
        }, { headers });
    }

    sendChangeUserImageRequest(image: string): Observable<any> {
        const headers = this.headersApp.set('Authorization', this.AuthToken);
        const user_id = this.AuthUser.id;
        return this.http.patch(`${environment.apiBaseURL}/usuarios/${user_id}/cambiar-avatar`, {
            avatar: image
        }, { headers });
    }

    sendEditProfileRequest(profile: IEditProfile): Observable<any> {
        const headers = this.headersApp.set('Authorization', this.AuthToken);
        const user_id = this.AuthUser.id;
        return this.http.patch(`${environment.apiBaseURL}/usuarios/${user_id}`, profile, { headers });
    }

    sendRequestUserMembership(image: string) {
        const headers = this.headersApp.set('Authorization', this.AuthToken);
        const user_id = this.AuthUser.id;
        return this.http.patch(`${environment.apiBaseURL}/usuarios/${user_id}/solicitar-afiliacion`, {
            basic_service_image: image
        }, { headers });
    }

    sendRequestAddUserDevice(device: IPhoneUser) {
        const headers = this.headersApp.set('Authorization', this.AuthToken);
        const user_id = this.AuthUser.id;
        return this.http.post(`${environment.apiBaseURL}/usuarios/${user_id}/dispositivos`, device , { headers });
    }

    sendRequestDeleteUserDevice(device_id: number) {
        const headers = this.headersApp.set('Authorization', this.AuthToken);
        const user_id = this.AuthUser.id;
        return this.http.delete(`${environment.apiBaseURL}/usuarios/${user_id}/dispositivos/${device_id}`, { headers });
    }

    sendRequestDeleteSocialProfile(social_profile_id: number) {
        const headers = this.headersApp.set('Authorization', this.AuthToken);
        const user_id = this.AuthUser.id;
        return this.http.delete(`${environment.apiBaseURL}/usuarios/${user_id}/perfiles-sociales/${social_profile_id}`, { headers });
    }

    
}
