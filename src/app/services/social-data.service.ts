import { Injectable } from '@angular/core';
import { BehaviorSubject, of, Observable } from 'rxjs';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import { GooglePlus as Google } from '@ionic-native/google-plus/ngx';
import { Platform } from '@ionic/angular';
import { HttpRequestService } from "./http-request.service";
import { ErrorService } from './error.service';
import { MessagesService } from './messages.service';
import { IFacebookApiUser, IGoogleLoginResponse, IGoogleApiUser, IFacebookPicture } from '../interfaces/models';
import { catchError } from 'rxjs/operators';

interface GoogleUser {
    sub: string;
    name: string;
    given_name: string;
    family_name: string;
    picture: string;
    email: string;
    email_verified: boolean;
    locale: string;
}

@Injectable({
    providedIn: 'root'
})
export class SocialDataService {

    googleLoginData = new BehaviorSubject(null);
    fbLoginData = new BehaviorSubject(null);

    constructor(
        private httpRequest: HttpRequestService,
        private errorService: ErrorService,
        private messageService: MessagesService,
        private facebook: Facebook,
        private google: Google,
        private platform: Platform
    ) { }

    // Funcion para parsear los datos del login de google
    getGoogleDataMapped(googleUser: IGoogleApiUser) {
        const appUser = {
            first_name: googleUser.given_name,
            last_name: googleUser.family_name || googleUser.given_name || '',
            email: googleUser.email,
            social_id: googleUser.sub,
            provider: 'google',
            avatar: googleUser.picture,
            password: null,
            device: null
        }
        return appUser;
    }
    // Funcion para parsear los datos del login de facebook
    getFacebookDataMapped(fbUser: IFacebookApiUser) {
        const appUser = {
            first_name: fbUser.first_name,
            last_name: fbUser.last_name,
            email: fbUser.email,
            social_id: fbUser.id,
            provider: 'facebook',
            avatar: fbUser.image,
            password: null,
            device: null
        };
        return appUser;
    }

    // Funcion para usar el API de Google para mostrar pantalla login google
    async loginByGoogle(): Promise<any> {
        if (this.platform.is('cordova')) {
            try {
                const loginGoogle: IGoogleLoginResponse = await this.google.login({});
                const profileGoogle: IGoogleApiUser = await this.getGoogleData(loginGoogle).toPromise();
                await this.closeGoogleSession();
                return profileGoogle;
            } catch (error_http) {
                return null;
            }
        } else {
            const dumpProfile: IGoogleApiUser = {
                email_verified: false,
                family_name: 'Jose',
                given_name: 'Juan',
                locale: 'es',
                name: 'Juan Jose',
                picture: '',
                sub: '15',
                email: null
            };
            return dumpProfile;
        }
    }
    // Funcion para usar el API de Facebook para mostrar pantalla login Facebook
    async loginByFacebook(): Promise<IFacebookApiUser> {
        if (this.platform.is('cordova')) {
            const permisos = ['public_profile', 'email'];

            const respuestaLogin: FacebookLoginResponse = await this.facebook.login(permisos);
            const userId = respuestaLogin.authResponse.userID;
            const accessToken = respuestaLogin.authResponse.accessToken;
            const profile: IFacebookApiUser = await this.getFacebookData(accessToken, userId, permisos);
            if (!profile) {
                return null;
            }
            return profile
        } else {
            // this.messageService.showError('La aplicación de facebook no esta disponible');
            const dumpPicture: IFacebookPicture = {
                data: {
                    height: 150,
                    is_silhouette: false,
                    url: '',
                    width: 25
                }
            };
            const dumpProfile: IFacebookApiUser = {
                first_name: 'Juan',
                id: '15',
                last_name: 'Rodriguez',
                name: 'Juan Rodriguez',
                picture: dumpPicture,
                email: null,
                image: '',
            };
            return dumpProfile;
        }
    }
    // Function para llamar a la api de GRAPHQL y obtener los datos del perfil del usuario logueado
    async getFacebookData(accessToken: string, userId: string, permisos: any): Promise<IFacebookApiUser> {
        try {
            const url = `me?fields=id,name,first_name,last_name,email,picture&access_token=${accessToken}`;
            const profile: any = await this.facebook.api(url, permisos);
            profile.image = `https://graph.facebook.com/${userId}/picture?type=large`;
            // profile.email = 
            if (profile !== null) {
                return profile;
            } else {
                return null;
            }
        } catch (error_http) {
            return null;
        }
    }
    // Function para llamar a la api de Google y obtener los datos del perfil del usuario logueado
    getGoogleData(googleLogin: any): Observable<any> {
        const url = `https://www.googleapis.com/oauth2/v3/userinfo?alt=json`;
        return this.httpRequest.get(url, {}, {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${googleLogin.accessToken}`
        })
            .pipe(catchError(() => of({})))
    }

    // Función para cerrar la sesión de google una vez obtenidos los datos
    async closeGoogleSession() {
        try {
            await this.google.logout();
        } catch (error_http) {
            this.errorService.manageHttpError(error_http, 'No se pudo cerrar la sesion de Google');
        }
    }
    // Función para cerrar la sesión de facebook una vez obtenidos los datos
    async closeFacebookSession() {
        try {
            await this.facebook.logout();
        } catch (error_http) {
            this.errorService.manageHttpError(error_http, 'No se pudo cerrar la sesion de Facebook');
        }
    }

}
