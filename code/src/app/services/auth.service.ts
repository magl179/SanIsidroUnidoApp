import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { NavController } from '@ionic/angular';


@Injectable({
    providedIn: 'root'
})
export class AuthService {

    authHeaders = new HttpHeaders({
        'Content-Type': 'application/json'
    });
    authUser = new BehaviorSubject(null);
    authToken = new BehaviorSubject(null);

    constructor(
        private storage: Storage,
        private http: HttpClient,
        private navCtrl: NavController
    ) { 
    }

    login(provider: string, loginData: any, getToken = null): Observable<any> {
        //Añadir Proveedor Datos
        loginData.provider = provider;
        const urlApi = `${environment.apiBaseURL}/login`;
        if (getToken !== null) {
            loginData.getToken = true;
        }
        return this.http.post(urlApi, loginData, {
            headers: this.authHeaders
        });
    }

    register(provider: string, registerData: any): Observable<any> {
        const urlApi = `${environment.apiBaseURL}/registro`;
        registerData.provider = provider;
        return this.http.post(urlApi, registerData, {
            headers: this.authHeaders
        });
    }

    updateAuthInfo(token, user) {
        this.setToken(token);
        this.setUser(user);
        this.checkInfoLocal();
    }
    //Actualizar toda la información desde LS
    checkInfoLocal() {
        this.checkAuthToken();
        this.checkAuthUser();
    }
    //COMPROBAR EN EL API SI TOKEN ES VÁLIDO
    tokenIsValid(token) {
        const urlApi = `${environment.apiBaseURL}/check-token`;
        const headers = this.authHeaders.set('Authorization', token);
        return this.http.post(urlApi, {}, { headers }).pipe(
            catchError(err => {
                return throwError(err);
            })
        );
    }
    //VERIFICAR SI SE DEBE CHECKEAR VALIDEZ TOKEN
    async checkValidToken() {
        await this.checkAuthToken();
        // console.log('Auth Token', this.authToken.value);
        this.getTokenSubject().subscribe(token => {
            if (token) {
                this.tokenIsValid(token).subscribe((res: any) => {
                    if (res.code === 200 && res.data.token == 'valid') {
                        console.log('Token Válido');
                    } else {
                        console.log('Token Inválido');
                    }
                });
            }else {
                console.log('No hay token guardado');
            }
        });
    }
    //CERRAR SESION
    async logout() {
        const accessToken = await this.storage.get('accessToken');
        await this.removeUser();
        await this.removeToken();
    }
    //Verificar Usuario Autenticado
    async isAuthenticated() {
        const user = await this.getCurrentUser();
        if (user) {
            return true;
        } else {
            return false;
        }
    }
   
    // aCTUALIZAR DATOS DESDE LOCAL STORAGE
    async checkAuthUser() {
        await this.storage.get('currentUser').then(res => {
            if (res) {
                this.authUser.next(res);
            }
        });
    }
    
    async checkAuthToken() {
        await this.storage.get('accessToken').then(res => {
            if (res) {
                this.authToken.next(res);
            }
        });
    }
     //Retornar Datos como Observables
     getUserSubject() {
        return this.authUser.asObservable();
    }
    getTokenSubject() {
        return this.authToken.asObservable();
    }
    //Obtener Datos como una Promesa
    async getCurrentUser() {
        await this.checkInfoLocal();
        return this.authUser.value;
    }
    async getToken() {
        await this.checkInfoLocal();
        return this.authToken.value;
    }

    //Actualizar  DATOS LOCAL STORAGE
    async setUser(user) {
        // user.id = user.id || 1;
        await this.storage.set('currentUser', user);
        this.authUser.next(user);
    }

    async setToken(token) {
        await this.storage.set('accessToken', token);
        this.authToken.next(token);
    }
    // Eliminar Datos Local Storage
    async removeUser() {
        await this.storage.remove('currentUser');
        this.authUser.next(null);
    }

    async removeToken() {
        await this.storage.remove('accessToken');
        this.authToken.next(null);
    }

    //Verificar Roles Usuario

    getUserRoles() {
        return this.authUser.value.user.roles.map(role => role.slug);
    }

    hasRoles(allowedRoles: string[]): boolean {
        let hasRole = false;
        if (this.authUser.value.user) {
            let userRoles = this.getUserRoles();
            for (const oneRole of allowedRoles) {
                if (userRoles.includes(oneRole.toLowerCase())) {
                    hasRole = true;
                }
            }
        }
        return hasRole;
    }

}
