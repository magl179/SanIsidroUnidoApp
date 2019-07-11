import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs';
// import { UserLogued } from 'src/app/interfaces/barrios';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    headers: HttpHeaders = new HttpHeaders({
        'Content-Type': 'application/json'
    });

    user = new BehaviorSubject(null);
    authToken = new BehaviorSubject(null);

    constructor(
        private storage: Storage,
        private http: HttpClient
    ) { }

    login(provider: string, loginData: {}): Observable<any> {
        const urlApi = 'http://localhost:3000/api/Users/login?include=user';
        const urlTest = 'assets/data/user.json';
        return this.http.get(urlTest).pipe(map(data => data));
        /*return this.http
        .post(
          url_api,
          {
              provider: provider,
              email: loginData.email,
              password: loginData.password,
              socialID: loginData.socialID
           },
          { headers: this.headers }
        )*/
    }

    register(provider: string, registerData: {}): Observable<any> {
        const urlApi = 'http://localhost:3000/api/Users';
        const urlTest = 'assets/data/user.json';
        /*  return this.htttp
      .post<UserInterface>(
        url_api,
        {
          provider: provider,
          firstname: registerData.firstname,
          email: registerData.email,
          password: registerData.password
        },
        { headers: this.headers }*/
        return this.http.get(urlTest).pipe(map( data => data));
    }

    async logout() {
        const accessToken = await this.storage.get('accessToken');
        const urlApi = `http://localhost:3000/api/Users/logout?access_token=${accessToken}`;
        await this.removeUser();
        await this.removeToken();
    }

    async isAuthenticated() {
        const user = await this.getCurrentUser();
        if (user) {
            return true;
        } else {
            return false;
        }
    }

    async getCurrentUser() {
        await this.storage.get('currentUser').then(res => {
            if (res) {
                this.user.next(res);
            }
        });
        // console.log('Auth Get Current User', this.user.value);
        return this.user.value;
    }

    async getToken() {
        await this.storage.get('accessToken').then(res => {
            if (res) {
                this.authToken.next(res);
            }
        });
        return this.authToken.value;
    }

    async setUser(user) {
        await this.storage.set('currentUser', user);
        this.user.next(user);
    }


    async setToken(token) {
        await this.storage.set('accessToken', token);
        this.authToken.next(token);
    }

    async removeUser() {
        await this.storage.remove('currentUser');
        this.user.next(null);
    }

    async removeToken() {
        await this.storage.remove('accessToken');
        this.authToken.next(null);
    }


}
