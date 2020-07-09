import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Observable, BehaviorSubject, from, Subject, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IRegisterUser, ITokenDecoded } from 'src/app/interfaces/models';
import { HttpRequestService } from "./http-request.service";
import { setHeaders } from "src/app/helpers/utils";
import { NavController } from "@ionic/angular";
import { tokenIsExpired } from 'src/app/helpers/auth-helper';
import { IRespuestaApiSIUSingle } from "src/app/interfaces/models";
import { CONFIG } from 'src/config/config';
import { MessagesService } from './messages.service';
import { getUserRoles, hasRoles } from 'src/app/helpers/user-helper';
import { map, takeUntil } from 'rxjs/operators';
import { EventsService } from './events.service';

const TOKEN_ITEM_NAME = "siuAccessToken";
const USER_ITEM_NAME = "siuCurrentUser";
const METHOD_LOGIN_NAME = "siuMethodLogin";

@Injectable({
    providedIn: 'root'
})
export class AuthService implements OnInit, OnDestroy{

    sessionAuthUserSubject = new BehaviorSubject(null);
    sessionAuthTokenSubject = new BehaviorSubject(null);
    private unsubscribe = new Subject<void>();
    sessionAuthUser = this.sessionAuthUserSubject.asObservable()
    sessionAuthToken = this.sessionAuthTokenSubject.asObservable()

    constructor(
        private storage: Storage,
        private navCtrl: NavController,
        private httpRequest: HttpRequestService,
        private messageService: MessagesService,
        private eventsService: EventsService
    ) {
        this.storage.ready().then(async() => {
            await this.getTokenandUserLS();
        });
    }

    ngOnInit(){
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    // ngOnInit
    async getTokenandUserLS() {
        const getTokenLS = new Promise((resolve) => {
            this.storage.get(TOKEN_ITEM_NAME).then(token_encoded => {
                this.sessionAuthTokenSubject.next(token_encoded);
                resolve(true);
            });
        });
        const getUserLS = new Promise((resolve) => {
            this.storage.get(USER_ITEM_NAME).then(token_decoded => {
                this.sessionAuthUserSubject.next(token_decoded);
                resolve(true);
            });
        });
        return await Promise.all([getTokenLS, getUserLS]);

       
    }

    // Iniciar Sesion del Usuario
    login(loginData): Observable<any> {
        const headers = CONFIG.API_HEADERS;
        const urlApi = `${environment.APIBASEURL}/login`;
        return this.httpRequest.post(urlApi, loginData, headers);
    }
    // Registrar al Usuario
    register(registerData: IRegisterUser): Observable<any> {
        const headers = CONFIG.API_HEADERS;
        const urlApi = `${environment.APIBASEURL}/registro`;
        return this.httpRequest.post(urlApi, registerData, headers);
    }
    //COMPROBAR EN EL API SI TOKEN ES VÁLIDO
    tokenIsValid(token: string) {
        const urlApi = `${environment.APIBASEURL}/verificar-token`;
        const headers = setHeaders(CONFIG.AUTHORIZATION_NAME, token)
        return this.httpRequest.post(urlApi, {}, headers);
    }
    //CERRAR SESION del usuario, borrando los datos del local storage
    async logout(message = 'Tu sesión expiro, inicia sesión por favor') {
        this.eventsService.logoutDevice.emit({disconnect: true});
        // return;
        this.cleanLocalStorage();
        this.cleanAuthInfo();
        this.removeMethodLogin();
        if(message !== ''){
            this.messageService.showInfo(message);
        }
        setTimeout(()=>{
            this.navCtrl.navigateRoot('/home-screen', { replaceUrl: true });
        }, 700);
    }

    setMethodLogin(tipo: string){
        this.storage.set(METHOD_LOGIN_NAME, tipo);
    }

    async getMethodLogin(){
        return await this.storage.get(METHOD_LOGIN_NAME);
    }

    removeMethodLogin(){
        this.storage.remove(METHOD_LOGIN_NAME)
    }

    async redirectToLogin(){
        this.cleanAuthInfo();
        this.cleanLocalStorage();
        this.navCtrl.navigateRoot('/home-screen', { replaceUrl: true });
    }
    //VERIFICAR SI SE DEBE CHECKEAR VALIDEZ TOKEN
    async checkValidToken() {
        if (this.tokenExists()) {
            const itemToken = await this.storage.get(TOKEN_ITEM_NAME);
            const isTokenExpired = tokenIsExpired(itemToken);
            if (itemToken && isTokenExpired) {
                return this.tokenIsValid(itemToken).subscribe(async(res: IRespuestaApiSIUSingle) => {
                    if (res.data && res.data.token) {
                        if (res.data.token === 'invalid') {
                            await this.logout();
                            return;
                        } else {
                            return;
                        }
                    } else {
                        return;
                    }
                }, () => {
                    return;
                });
            } else {
                return;
            }
        } else {
            return;
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

    async saveUserInfo(token_encoded: string, token_decoded: ITokenDecoded) {
        this.sessionAuthTokenSubject.next(token_encoded);
        this.sessionAuthUserSubject.next(token_decoded);
    }
    async saveLocalStorageInfo(token_encoded: string, token_decoded: ITokenDecoded) {
        this.storage.set(TOKEN_ITEM_NAME, token_encoded);
        this.storage.set(USER_ITEM_NAME, token_decoded);
    }
    //Verificar si el usuario esta autenticado, es decir tiene su datos en el local storage
    async isAuthenticated(): Promise<any> {
        const getTokenLS = new Promise((resolve) => {
            this.storage.get(TOKEN_ITEM_NAME).then(token_encoded => {
                resolve(token_encoded);
            });
        });
        return await getTokenLS;
    }
    //Obtener el usuario autenticado del Local Storage
    async getTokenUserAuthenticated(): Promise<any> {
        return new Promise((resolve) => {
            this.storage.get(USER_ITEM_NAME).then(token_decoded => {
                resolve(token_decoded);
            });
        });
    }

    getUserAuthRxjs():Observable<any> {
        return from(this.getTokenUserAuthenticated()).pipe(
            map((response: ITokenDecoded) => {
              return response;
            })
        )
    }

    // Verificar si el token esta guardado en el local storage
    async tokenExists() {
        const itemToken = await this.storage.get(TOKEN_ITEM_NAME);
        const tokenExists = !!itemToken;
        return tokenExists;
    }

    async userHasRole(roles_verificar: string[]){
        const tokenDecoded = await this.getTokenUserAuthenticated();
        if(!tokenDecoded){
            return false;
        }
        let userRoles = getUserRoles(tokenDecoded);
        if (hasRoles(userRoles, roles_verificar)){
            return true;
        }else{
            return false;
        }       
   }

}
