import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JwtHelperService } from "@auth0/angular-jwt";
import { environment } from '../../environments/environment';
import { IRegisterUser } from '../interfaces/models';
import { HttpRequestService } from "./http-request.service";
import { UtilsService } from "./utils.service";

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
        private http: HttpClient,
        private utilsService: UtilsService,
        private httpRequest: HttpRequestService
    ) { }
    //CERRAR SESION del usuario, borrando los datos del local storage
    async logout() {
        await this.removeAuthInfo();
    }
    // Iniciar Sesion del Usuario
    login(loginData: any, getToken = null): Observable<any> {
        const urlApi = `${environment.apiBaseURL}/login`;
        if (getToken !== null) {
            loginData.getToken = true;
        }
        return this.httpRequest.post(urlApi, loginData, this.authHeaders);
    }
    // Registrar al Usuario
    register(registerData: IRegisterUser): Observable<any> {
        const urlApi = `${environment.apiBaseURL}/registro`;
        return this.httpRequest.post(urlApi, registerData, this.authHeaders);
    }
    //COMPROBAR EN EL API SI TOKEN ES VÁLIDO
    tokenIsValid(token) {
        const urlApi = `${environment.apiBaseURL}/verificar-token`;
        const headers = this.authHeaders.set(environment.AUTHORIZATION_NAME, token);
        return this.httpRequest.post(urlApi, {}, headers);
    }
    // Decodificar el Token
    decodeToken(token: any) {
        let decodedToken = null;
        try {
            const helper = new JwtHelperService();
            decodedToken = helper.decodeToken(token);
        } catch (err) {
            console.log(err);
        }
        return decodedToken;
    }
    // Validar si el token ha expirado
    tokenIsExpired(token) {
        const helper = new JwtHelperService();
        const isExpired = helper.isTokenExpired(token);
        return isExpired;
    }
    //VERIFICAR SI SE DEBE CHECKEAR VALIDEZ TOKEN
    async checkValidToken() {
        if (this.tokenExists()) {
            const itemToken = await this.storage.get(TOKEN_ITEM_NAME);
            if (itemToken) {
                const isTokenExpired = this.tokenIsExpired(itemToken);
                if (isTokenExpired) {
                    this.tokenIsValid(itemToken).subscribe(res => {
                        console.log('Token Válido');
                    }, err => {
                        console.log('Error Validar Token', err);
                    });
                } else {
                    // console.log('Token no expirado');
                }
            } else {
                // console.log('No existe Token');
            }
        }
    }

    async updateFullAuthInfo(token: any) {
        const tokenDecoded = this.decodeToken(token);
        this.updateAuthInfo(token, tokenDecoded);
    }

    async updateUserInfo(user: any) {
        await this.setUserLocalStorage(user);
        await this.getUserLocalStorage();
    }
    // Actualizar Informacion Local Storage
    async updateAuthInfo(token: any, user: any) {
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
    //Verificar si el usuario esta autenticado, es decir tiene su datos en el local storage
    async isAuthenticated() {
        const itemUser = await this.storage.get(USER_ITEM_NAME);
        const isAuthenticated = !!itemUser;
        return isAuthenticated;
    }
    // Verificar si el token esta guardado en el local storage
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
    // Traer los Datos del Token del Local Storage
    async getUserLocalStorage() {
        const token_decoded = await this.storage.get(USER_ITEM_NAME);
        this.authUser.next(token_decoded);
        if (token_decoded && token_decoded.user) {
            this.mapUserInfo();
        }
        // console.log('get user ls value', this.authUser.value);
    }
    mapUserInfo() {
        if (this.authUser.value.user) {
            this.authUser.value.user.avatar = this.utilsService.getImageURL(this.authUser.value.user.avatar);
        }
    }
    // Traer los Datos del Usuario del Local Storage
    async getTokenLocalStorage() {
        const token = await this.storage.get(TOKEN_ITEM_NAME);
        this.authToken.next(token);
        // console.log('get token ls value', this.authToken.value);
    }
    // Guardar los Datos del Usuario en el Local Storage
    async setUserLocalStorage(user) {
        await this.storage.set(USER_ITEM_NAME, user);
        this.authUser.next(user);
    }
    // Guardar los Datos del Token en el Local Storage
    async setTokenLocalStorage(token) {
        await this.storage.set(TOKEN_ITEM_NAME, token);
        this.authToken.next(token);
    }
    // Eliminar los Datos del Usuario del Local Storage
    async removeUserLocalStorage() {
        await this.storage.remove(USER_ITEM_NAME);
        this.authUser.next(null);
    }
    // Eliminar los Datos del Token del Local Storage
    async removeTokenLocalStorage() {
        await this.storage.remove(TOKEN_ITEM_NAME);
        this.authToken.next(null);
    }
    //Obtener los Roles Usuario
    getUserRoles(user_decoded) {
        // console.log('get user roles', user_decoded);
        return (user_decoded) ? user_decoded.user.roles.map(role => role.slug) : [];
    }
    // Verificar si un usuario tiene unos roles en especifico
    async hasRoles(allowedRoles: string[]) {
        let hasRole = false;
        if (this.isAuthenticated()) {
            if (!this.authUser.value) {
                await this.getUserLocalStorage();
            }
            let userRoles = await this.getUserRoles(this.authUser.value);
            // console.log('userRoles', userRoles);
            // console.log('allowedRoles', allowedRoles);
            for (const oneRole of allowedRoles) {
                if (userRoles.includes(oneRole.toLowerCase())) {
                    hasRole = true;
                }
            }
        }
        return hasRole;
    }
    //Verificar si el usuario esta activo
    async isActive() {
        if (this.isAuthenticated()) {
            if (!this.authUser.value) {
                await this.getUserLocalStorage();
            }
            let isActive = false;
            if (this.authUser.value.user.state === 1) {
                isActive = true;
            }
            return isActive;
        } else {
            return false;
        }
    }

}
