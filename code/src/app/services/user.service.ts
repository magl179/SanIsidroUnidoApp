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
        this.auth.getUserSubject().subscribe(user => {
            if (user) {
                this.currentUser = user;
            }
        });
        this.auth.getTokenSubject().subscribe(token => {
            if (token) {
                this.tokenUser = token;
            }
        });
    }

    async ngOnInit() {
        // this.tokenUser = await this.auth.getToken();
        // await this.auth.getUserSubject().subscribe(user => {
        //     if (user) {
        //         this.currentUser = user;
        //     }
        // });
        // await this.auth.getTokenSubject().subscribe(token => {
        //     if (token) {
        //         this.tokenUser = token;
        //     }
        // });
        // this.currentUser = await this.auth.getCurrentUser();
        console.log('User', this.currentUser);
    }

    sendChangeUserPassRequest(newPassword: string): Observable<any> {
        this.headersApp.set('Authorization', this.tokenUser);
        const user_id = this.currentUser.id;
        return this.http.patch(`${environment.apiBaseURL}/usuarios/${user_id}/cambiar-contrasenia`, {
            password: newPassword
        }, {
                headers: this.headersApp
            });
    }

    sendChangeUserImageRequest(image: string): Observable<any> {
        this.headersApp.set('Authorization', this.tokenUser);
        const user_id = this.currentUser.id;
        return this.http.patch(`${environment.apiBaseURL}/usuarios/${user_id}/cambiar-avatar`, {
            avatar: image
        }, {
                headers: this.headersApp
            });
    }

    sendEditProfileRequest(profile: IEditProfile): Observable<any> {
        console.log('current user', this.currentUser);
        this.headersApp.set('Authorization', this.tokenUser);
        const user_id = this.currentUser.id;
        return this.http.put(`${environment.apiBaseURL}/usuarios/${user_id}`, profile, {
            headers: this.headersApp
        });
    }

    sendRequestUserMembership(image: string) {
        this.headersApp.set('Authorization', this.tokenUser);
        const user_id = this.currentUser.id;
        return this.http.patch(`${environment.apiBaseURL}/usuarios/${user_id}/solicitar-afiliacion`, {
            basic_service_image: image
        }, {
                headers: this.headersApp
            });
    }

    getUserInfo(id: number): Observable<any> {
        return this.http.get(`${environment.apiBaseURL}/usuarios/${id}`);
    }
}
