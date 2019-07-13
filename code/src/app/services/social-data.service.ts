import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Platform } from '@ionic/angular';
import { UtilsService } from './utils.service';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class SocialDataService {

    googleLoginData = new BehaviorSubject(null);
    fbLoginData = new BehaviorSubject(null);

    constructor(
        private http: HttpClient,
        private facebook: Facebook,
        private googlePlus: GooglePlus,
        private platform: Platform,
        private utilsService: UtilsService
    ) { }


    testFBLoginFake(): Observable<any> {
        const urlTest = 'assets/data/fb.json';
        return this.http.get(urlTest).pipe(map(data => data));
    }

    testGoogleLoginFake(): Observable<any> {
        const urlTest = 'assets/data/google.json';
        return this.http.get(urlTest).pipe(map(data => data));
    }

    getOwnGoogleUser(googleUser: any) {
        const appUser = {
            firstname: googleUser.displayName,
            lastname: googleUser.name.givenName,
            email: googleUser.emails[0].value,
            token_id: googleUser.id,
            provider: 'google',
            avatar: googleUser.image.url,
            password: null
        };
        console.log('OWN GOOGLE DATA', appUser);
        return appUser;
    }

    getOwnFacebookUser(fbUser: any) {
        const appUser = {
            firstname: fbUser.first_name,
            lastname: fbUser.last_name,
            email: fbUser.email,
            token_id: fbUser.id,
            provider: 'facebook',
            avatar: fbUser.image,
            password: null
        };
        console.log('OWN FB DATA', appUser);
        return appUser;
    }

    async loginByGoogle() {
        if (this.platform.is('cordova')) {
            console.log('login is cordova');
            this.googlePlus.trySilentLogin({
                offline: true,
                webClientId: environment.googleClientID
            }).then(data => {
                console.log('Luego del Login then', data);
            }).catch(err => {
                console.log(err);
            });
            console.log('Luego del Login');
        } else {
            await this.utilsService.showToast('Cordova Google no esta disponible', null, 'bottom');
        }
    }

    // Función Obtener Datos de Google
    async getGoogleData(token) {
        // Pedir Info a Google Plus Api pasandole el access token
        await this.http.get(`https://www.googleapis.com/plus/v1/people/me?access_token=${token}`).subscribe(
            (profile: any) => {
                console.log('Datos Google', profile);
                if (profile) {
                    this.googleLoginData.next(profile);
                    this.closeGoogleSession();
                } else {
                    console.log('datos vacios google');
                }
            },
            err => {
                console.log(err);
            });
    }

    async closeGoogleSession() {
        try {
            await this.googlePlus.logout();
            console.log('Google Logout Succesfull');
        } catch (err) {
            console.log(err);
        }
    }


    async  loginByFacebook() {
        // Verificar Si Existe Cordova
        if (this.platform.is('cordova')) {
            // Añadir los permisos en un array
            const permisos = ['public_profile', 'email'];
            // En un TRY-CATCH ejecutamos la consulta y capturamos el 	error
            try {
                // ejecutar el login de facebook y lo guardo en una variable
                const respuestaLogin: FacebookLoginResponse = await this.facebook.login(permisos);
                // guardo el userID del Usuario que hace la petición
                const userId = await respuestaLogin.authResponse.userID;
                // guardo el access token que me retorna la petición de logueo
                const accessToken = await respuestaLogin.authResponse.accessToken;
                // llamo función para obtener datos de Facebook, le paso el access token, los permisos y el userId
                await this.getFacebookData(accessToken, userId, permisos);
                console.log('Respuesta Login', respuestaLogin);
            } catch (err) {
                console.log(err);
                await this.utilsService.showToast('Ocurrio un error al conectarse con facebook', null, 'bottom');
            }
        } else {
            console.log('Cordova FACE no esta disponible');
            await this.utilsService.showToast('Cordova no Disponible', null, 'bottom');
        }
    }

    async getFacebookData(accessToken: string, userId: string, permisos: any) {
        try {
            // guardo la respuesta de la petición de datos a la API FB
            // tslint:disable-next-line: max-line-length
            const profile: any = await this.facebook.api(`${userId}?fields=id,name,first_name,last_name,email,picture&access_token=${accessToken}`, permisos);
            // Imprimo los datos que trae, en el caso de este ejemplo
            // en las notas adicionales especifico el formato dato que retorna
            console.log('Datos Perfil Usuario', profile);
            // Añadir campo image y traer imagen grande usuario
            profile.image = `https://graph.facebook.com/${userId}/picture?type=large`;
            if (profile !== null) {
                this.fbLoginData.next(profile);
                this.closeFacebookSession();
            }
        } catch (err) {
            console.log(err);
        }
    }

    async closeFacebookSession() {
        try {
            await this.facebook.logout();
            console.log('Successfull Facebook Logout');
        } catch (err) {
            console.log(err);
        }
    }




}
