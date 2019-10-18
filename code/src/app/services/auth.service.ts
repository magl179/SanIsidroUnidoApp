import { Injectable, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IRegisterUser } from 'src/app/interfaces/models';
import { HttpRequestService } from "./http-request.service";
import { setHeaders } from "src/app/helpers/utils";
import { NavController, Platform } from "@ionic/angular";
import { tokenIsExpired } from 'src/app/helpers/auth-helper';
import { IRespuestaApiSIUSingle } from "../interfaces/models";

const TOKEN_ITEM_NAME = "accessToken";
const USER_ITEM_NAME = "currentUser";

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    sessionAuthUserSubject = new BehaviorSubject(null);
    sessionAuthTokenSubject = new BehaviorSubject(null);
    sessionAuthUser = this.sessionAuthUserSubject.asObservable();
    sessionAuthToken = this.sessionAuthTokenSubject.asObservable();

    constructor(
        private storage: Storage,
        private navCtrl: NavController,
        private httpRequest: HttpRequestService,
        private platform: Platform
    ) {

        this.storage.ready().then(async () => {
            //this.storage.keys().then(keys => console.log('keys', keys));
            //this.storage.length().then(length => console.log('length', length));
            // console.log('driver', this.storage.driver);
            await this.getTokenandUserLS();
        });
    }

    // ngOnInit
    async getTokenandUserLS() {
        const getTokenLS = new Promise((resolve, reject) => {
            this.storage.get(TOKEN_ITEM_NAME).then(token_encoded => {
                this.sessionAuthTokenSubject.next(token_encoded);
                resolve(true);
            });
        });
        const getUserLS = new Promise((resolve, reject) => {
            this.storage.get(USER_ITEM_NAME).then(token_decoded => {
                this.sessionAuthUserSubject.next(token_decoded);
                console.log('user storage constructor auth service', token_decoded);
                resolve(true);
            });
        });
        return await Promise.all([getTokenLS, getUserLS]);


    }

    // async isAuthenticated() {
    //     return !! await this.storage.get(TOKEN_ITEM_NAME); 
    // }

    // Iniciar Sesion del Usuario
    login(loginData: any, getToken = null): Observable<any> {
        const headers = environment.headersApp;
        const urlApi = `${environment.apiBaseURL}/login`;
        if (getToken !== null) {
            loginData.getToken = true;
        }
        return this.httpRequest.post(urlApi, loginData, headers);
    }
    // Registrar al Usuario
    register(registerData: IRegisterUser): Observable<any> {
        const headers = environment.headersApp;
        const urlApi = `${environment.apiBaseURL}/registro`;
        return this.httpRequest.post(urlApi, registerData, headers);
    }
    //COMPROBAR EN EL API SI TOKEN ES VÁLIDO
    tokenIsValid(token: any) {
        const urlApi = `${environment.apiBaseURL}/verificar-token`;
        const headers = setHeaders(environment.AUTHORIZATION_NAME, token)
        return this.httpRequest.post(urlApi, {}, headers);
    }
    //CERRAR SESION del usuario, borrando los datos del local storage
    async logout() {
        this.cleanLocalStorage();
        this.cleanAuthInfo();
        this.navCtrl.navigateRoot('/login');
    }
    //VERIFICAR SI SE DEBE CHECKEAR VALIDEZ TOKEN
    async checkValidToken() {
        if (this.tokenExists()) {
            const itemToken = await this.storage.get(TOKEN_ITEM_NAME);
            //console.log('value check token get', itemToken)
            if (itemToken) {
                const isTokenExpired = tokenIsExpired(itemToken);
                if (isTokenExpired) {
                    this.tokenIsValid(itemToken).subscribe((res: IRespuestaApiSIUSingle) => {
                        if (res.data && res.data.token) {
                            if (res.data.token === 'invalid') {
                                this.logout();
                            } else {
                                console.log('Token Válido');
                            }
                        } else {
                            console.log('Error al Validar el Token en el servidor', res);
                        }
                    }, err => {
                        console.log('Error al Validar el Token en el servidor', err);
                    });
                } else {
                    // console.log('Token no expirado');
                }
            } else {
                // console.log('No existe Token');
            }
        }
    }
    cleanLocalStorage() {
        this.storage.remove(USER_ITEM_NAME)
        this.storage.remove(TOKEN_ITEM_NAME);
    }
    cleanAuthInfo() {
        this.sessionAuthTokenSubject.next(null);
        this.sessionAuthUserSubject.next(null);
    }

    async saveUserInfo(token_encoded: any, token_decoded: any) {
        this.sessionAuthTokenSubject.next(token_encoded);
        this.sessionAuthUserSubject.next(token_decoded);
    }
    async saveLocalStorageInfo(token_encoded: any, token_decoded: any) {
        console.log('save local storage info called', { a: token_encoded, b: token_decoded })
        this.storage.set(TOKEN_ITEM_NAME, token_encoded);
        this.storage.set(USER_ITEM_NAME, token_decoded);
        this.storage.get(USER_ITEM_NAME).then(token_decoded => {
            console.log('user storage save local storage info', token_decoded)
        });
    }
    //Verificar si el usuario esta autenticado, es decir tiene su datos en el local storage
    async isAuthenticated() {
        //const itemUser = await this.storage.get(USER_ITEM_NAME);
        const getTokenLS = new Promise((resolve, reject) => {
            this.storage.get(TOKEN_ITEM_NAME).then(token_encoded => {
                resolve(token_encoded);
            });
        });

        // const isAuthenticated = !!itemUser;
        return await getTokenLS;
    }

    // Verificar si el token esta guardado en el local storage
    async tokenExists() {
        const itemToken = await this.storage.get(TOKEN_ITEM_NAME);
        const tokenExists = !!itemToken;
        return tokenExists;
    }

}
