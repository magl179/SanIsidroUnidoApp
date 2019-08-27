import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
// import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
// import { NavController } from '@ionic/angular';
import { ILoginUser, IRegisterUser } from '../interfaces/models';

const TOKEN_ITEM_NAME = "accessToken";
const USER_ITEM_NAME = "currentUser";

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
        private http: HttpClient
    ) {
        // this.verificarAuthInfo();
    }
    //CERRAR SESION
    async logout() {
        await this.removeAuthInfo();
    }
    // Iniciar Sesion
    login(loginData: any, getToken = null): Observable<any> {
        // URL API LOGIN
        const urlApi = `${environment.apiBaseURL}/login`;
        // const loginBody: ILoginUser = {
        //     provider,
        //     email: loginData.email
        // }
        // if (provider == 'formulario') {
        //     loginBody.password = loginData.password
        // } else {
        //     loginBody.social_id = loginData.token_id
        // }
        if (getToken !== null) {
            loginData.getToken = true;
        }
        return this.http.post(urlApi, loginData, {
            headers: this.authHeaders
        });
    }
    // Registrar Usuario
    
    register(registerData: IRegisterUser): Observable<any> {
        const urlApi = `${environment.apiBaseURL}/registro`;
        return this.http.post(urlApi, registerData, {
            headers: this.authHeaders
        });
    }
    //COMPROBAR EN EL API SI TOKEN ES VÁLIDO
    tokenIsValid(token) {
        const urlApi = `${environment.apiBaseURL}/verificar-token`;
        const headers = this.authHeaders.set('Authorization', token);
        return this.http.post(urlApi, {}, { headers });
    }
    //VERIFICAR SI SE DEBE CHECKEAR VALIDEZ TOKEN
    async checkValidToken() {
        if (this.tokenExists()) {
            const itemToken = await this.storage.get(TOKEN_ITEM_NAME);
            if (itemToken) {
                // console.log('item token to check', itemToken);
                this.tokenIsValid(itemToken).subscribe( res=> {
                    console.log('Token Válido');
                }, err => {
                    console.log('Error Validar Token', err);
                });
            } else {
                console.log('No existe Token');
            }
        }
    }
    // Actualizar Informacion Local Storage
    async updateAuthInfo(token, user) {
        await this.setTokenLocalStorage(token);
        await this.setUserLocalStorage(user);
        await this.getUserLocalStorage();
        await this.getTokenLocalStorage();
        
    }
    //Obtener la información desde Local Storage
    async verificarAuthInfo() {
        await this.getUserLocalStorage();
        await this.getTokenLocalStorage();
        await this.checkValidToken();
    }
    // Eliminar historia del Local Storage
    removeAuthInfo() {
        this.removeTokenLocalStorage();
        this.removeUserLocalStorage();
    }
    //Verificar Usuario Autenticado
    async isAuthenticated() {
        const itemUser = await this.storage.get(USER_ITEM_NAME);
        const isAuthenticated = !!itemUser;
        return isAuthenticated;
    }

    async tokenExists() {
        const itemToken = await this.storage.get(TOKEN_ITEM_NAME);
        const tokenExists = !!itemToken;
        return tokenExists;
    }

    //Retornar Datos como Observables
    getAuthUser() {
        return this.authUser.asObservable();
    }
    getAuthToken() {
        return this.authToken.asObservable();
    }
  
    // Traer Token Local Storage
    async getUserLocalStorage() {
        const user = await this.storage.get(USER_ITEM_NAME)
        this.authUser.next(user);
        // console.log('get user ls value', this.authUser.value);
    }
    // Traer Usuario Local Storage
    async getTokenLocalStorage() {
        const token = await this.storage.get(TOKEN_ITEM_NAME);
        this.authToken.next(token);
        // console.log('get token ls value', this.authToken.value);
    }
    // Guardar Usuario Local Storage
    async setUserLocalStorage(user) {
        await this.storage.set(USER_ITEM_NAME, user);
        this.authUser.next(user);
    }
    // Guardar Token Local Storage
    async setTokenLocalStorage(token) {
        await this.storage.set(TOKEN_ITEM_NAME, token);
        this.authToken.next(token);
    }
    // Eliminar Usuario Local Storage
    async removeUserLocalStorage() {
        await this.storage.remove(USER_ITEM_NAME);
        this.authUser.next(null);
    }
    // Eliminar Token Local Storage
    async removeTokenLocalStorage() {
        await this.storage.remove(TOKEN_ITEM_NAME);
        this.authToken.next(null);
    }
    //Obtener Roles Usuario
    getUserRoles() {
        return this.authUser.value.user.roles.map(role => role.slug);
    }
    // Verificar Roles
    hasRoles(allowedRoles: string[]): boolean {
        let hasRole = false;
        // console.log('USER', this.authUser.value);
        if (this.isAuthenticated()) {
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
