import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';
import { IEditProfile } from 'src/app/interfaces/models';
import { catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class UserService implements OnInit {

    tokenUser = null;
    currentUser = null;

    headersApp = new HttpHeaders({
        'Content-Type': 'application/json'
    });

    constructor(
        private http: HttpClient,
        private auth: AuthService
    ) {
        this.auth.getUserSubject().subscribe(res => {
            if (res) {
                this.currentUser = res.user;
            }
        });
        this.auth.getTokenSubject().subscribe(token => {
            if (token) {
                this.tokenUser = token;
            }
        });
    }

    async ngOnInit() {
        console.log('User', this.currentUser);
    }

    sendChangeUserPassRequest(newPassword: string): Observable<any> {
        const headers = this.headersApp.set('Authorization', this.tokenUser);
        const user_id = this.currentUser.id;
        return this.http.patch(`${environment.apiBaseURL}/usuarios/${user_id}/cambiar-contrasenia`, {
            password: newPassword
        }, { headers: this.headersApp });
    }

    sendChangeUserImageRequest(image: string): Observable<any> {
        const headers = this.headersApp.set('Authorization', this.tokenUser);
        const user_id = this.currentUser.id;
        return this.http.patch(`${environment.apiBaseURL}/usuarios/${user_id}/cambiar-avatar`, {
            avatar: image
        }, { headers });
    }

    sendEditProfileRequest(profile: IEditProfile): Observable<any> {
        console.log('current user', this.currentUser);
        const headers = this.headersApp.set('Authorization', this.tokenUser);
        const user_id = this.currentUser.id;
        return this.http.patch(`${environment.apiBaseURL}/usuarios/${user_id}`, profile, { headers });
    }

    sendRequestUserMembership(image: string) {
        const headers = this.headersApp.set('Authorization', this.tokenUser);
        const user_id = this.currentUser.id;
        return this.http.patch(`${environment.apiBaseURL}/usuarios/${user_id}/solicitar-afiliacion`, {
            basic_service_image: image
        }, { headers });
    }

    sendRequestAddUserDevice(device_id: string, description: string) {
        const headers = this.headersApp.set('Authorization', this.tokenUser);
        const user_id = this.currentUser.id;
        return this.http.patch(`${environment.apiBaseURL}/usuarios/${user_id}/agregar-dispositivo`, {
            device_id, description
        }, { headers });
    }

    getUserInfo(id: number): Observable<any> {
        return this.http.get(`${environment.apiBaseURL}/usuarios/${id}`);
    }

    getNotificationsUser() {
        // const headers = this.headersApp;
        const user_id = this.currentUser.id;
        console.log('User noti', this.currentUser);
        console.log('User id noti', user_id);
        return this.http.get(`${environment.apiBaseURL}/usuarios/${user_id}/notificaciones`);
    }
}
