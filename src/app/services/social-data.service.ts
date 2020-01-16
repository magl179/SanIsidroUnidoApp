import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import { GooglePlus as Google } from '@ionic-native/google-plus/ngx';
import { Platform } from '@ionic/angular';
import { UtilsService } from './utils.service';
import { HttpRequestService } from "./http-request.service";
import { ErrorService } from './error.service';
import { MessagesService } from './messages.service';

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
        private platform: Platform,
        private utilsService: UtilsService
    ) { }

    // Funcion para parsear los datos del login de google
    getGoogleDataParsed(googleUser: any) {
        const appUser = {
            firstname: googleUser.name.givenName,
            lastname: googleUser.displayName,
            email: googleUser.emails[0].value,
            social_id: googleUser.id,
            provider: 'google',
            avatar: googleUser.avatar,
            password: null
        };
        return appUser;
    }
    // Funcion para parsear los datos del login de facebook
    getFacebookDataParsed(fbUser: any) {
        const appUser = {
            firstname: fbUser.first_name,
            lastname: fbUser.last_name,
            email: fbUser.email,
            social_id: fbUser.id,
            provider: 'facebook',
            avatar: fbUser.image,
            password: null
        };
        return appUser;
    }

    // Funcion para usar el API de Google para mostrar pantalla login google
    async loginByGoogle() {
        if (this.platform.is('cordova')) {
            try {
                const loginGoogle = await this.google.login({});
                this.getGoogleData(loginGoogle);
            } catch (error) {
                this.errorService.manageHttpError(error, 'Error con la conexion a Google');
            }
        } else {
            this.messageService.showError('Error con la conexion a Google');
        }
    }
    // Funcion para usar el API de Facebook para mostrar pantalla login Facebook
    async  loginByFacebook() {
        if (this.platform.is('cordova')) {
            const permisos = ['public_profile', 'email'];
            try {
                const respuestaLogin: FacebookLoginResponse = await this.facebook.login(permisos);
                const userId = respuestaLogin.authResponse.userID;
                const accessToken = respuestaLogin.authResponse.accessToken;
                await this.getFacebookData(accessToken, userId, permisos);
            } catch (err) {
                this.errorService.manageHttpError(err, 'Ocurrio un error al conectarse con facebook');
            }
        } else {
            this.messageService.showError('La aplicación de facebook no esta disponible');
        }
    }
    // Function para llamar a la api de GRAPHQL y obtener los datos del perfil del usuario logueado
    async getFacebookData(accessToken: string, userId: string, permisos: any) {
        try {
            const url = `${userId}?fields=id,name,first_name,last_name,email,picture&access_token=${accessToken}`;
            const profile: any = await this.facebook.api(url, permisos);
            profile.image = `https://graph.facebook.com/${userId}/picture?type=large`;
            if (profile !== null) {
                this.fbLoginData.next(profile);
                this.closeFacebookSession();
            } else {
                this.messageService.showError('No se pudo obtener los datos por medio de Facebook');
            }
        } catch (err) {
            this.errorService.manageHttpError(err, 'No se pudieron obtener los datos de facebook');
        }
    }
    // Function para llamar a la api de Google y obtener los datos del perfil del usuario logueado
    getGoogleData(googleLogin: any) {
        try {
            const url = `https://www.googleapis.com/plus/v1/people/me?access_token=${googleLogin.accessToken}`;
            this.httpRequest.get(url).subscribe(
                async (profile: any) => {
                    profile.avatar = googleLogin.imageUrl;
                    this.googleLoginData.next(profile);
                    await this.closeGoogleSession();                    
                },
                (err: any) => {
                    this.errorService.manageHttpError(err, 'No se pudieron obtener los datos de Google'); 
                });
        } catch (err) {
            this.errorService.manageHttpError(err, 'No se pudieron obtener los datos de Google');            
        }
    }

    // Función para cerrar la sesión de google una vez obtenidos los datos
    async closeGoogleSession() {
        try {
            await this.google.logout();
        } catch (err) {
            this.errorService.manageHttpError(err, 'No se pudo cerrar la sesion de Google');  
        }
    }
     // Función para cerrar la sesión de facebook una vez obtenidos los datos
    async closeFacebookSession() {
        try {
            await this.facebook.logout();
        } catch (err) {
            this.errorService.manageHttpError(err, 'No se pudo cerrar la sesion de Facebook');  
        }
    }

}
