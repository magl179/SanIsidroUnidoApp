import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import { GooglePlus as Google } from '@ionic-native/google-plus/ngx';
import { Platform } from '@ionic/angular';
import { UtilsService } from './utils.service';
// import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class SocialDataService {

    googleLoginData = new BehaviorSubject(null);
    fbLoginData = new BehaviorSubject(null);

    constructor(
        private http: HttpClient,
        private facebook: Facebook,
        private google: Google,
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

    getDataGoogleParsed(googleUser: any) {
        const appUser = {
            firstname: googleUser.displayName,
            lastname: googleUser.name.givenName,
            email: googleUser.emails[0].value,
            token_id: googleUser.id,
            provider: 'google',
            avatar: googleUser.image.url,
            password: null,
            roles: [
                'admin',
                'morador_invitado'
            ]
        };
        console.log('OWN GOOGLE DATA', appUser);
        return appUser;
    }

    getDataFacebookParsed(fbUser: any) {
        const appUser = {
            firstname: fbUser.first_name,
            lastname: fbUser.last_name,
            email: fbUser.email,
            token_id: fbUser.id,
            provider: 'facebook',
            avatar: fbUser.image,
            password: null,
            roles: [
                'admin',
                'morador_invitado'
            ]
        };
        console.log('OWN FB DATA', appUser);
        return appUser;
    }

    // LOGIN SOCIAL
    async loginByGoogle() {
        if (this.platform.is('cordova')) {
            console.log('login is cordova');
            try {
                const loginGoogle = await this.google.login({});
                console.log({ respuestaLoginGoogle: loginGoogle });
                await this.getGoogleData(loginGoogle.accessToken);
            } catch (error) {
                console.log(error);
                await this.utilsService.showToast('Eror con Google');
            }
            console.log('Luego del Login');
        } else {
            await this.utilsService.showToast('Cordova Google no esta disponible', null, 'bottom');
        }
    }

    async  loginByFacebook() {
        if (this.platform.is('cordova')) {
            const permisos = ['public_profile', 'email'];
            try {
                const respuestaLogin: FacebookLoginResponse = await this.facebook.login(permisos);
                const userId = await respuestaLogin.authResponse.userID;
                const accessToken = await respuestaLogin.authResponse.accessToken;
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

    // GET SOCIAL DATA

    async getFacebookData(accessToken: string, userId: string, permisos: any) {
        try {
            // tslint:disable-next-line: max-line-length
            const profile: any = await this.facebook.api(`${userId}?fields=id,name,first_name,last_name,email,picture&access_token=${accessToken}`, permisos);
            console.log('Datos Perfil Usuario', profile);
            profile.image = `https://graph.facebook.com/${userId}/picture?type=large`;
            if (profile !== null) {
                this.fbLoginData.next(profile);
                this.closeFacebookSession();
            } else {
                this.utilsService.showToast('No se pudo obtener los datos con Facebook');
            }
        } catch (err) {
            console.log(err);
        }
    }

    getGoogleData(token) {
        try {
            this.http.get(`https://www.googleapis.com/plus/v1/people/me?access_token=${token}`).subscribe(
                async (profile: any) => {
                    console.log('Datos Google', profile);
                    if (profile) {
                        this.googleLoginData.next(profile);
                        await this.closeGoogleSession();
                    } else {
                        this.utilsService.showToast('No se pudo obtener los datos con Google');
                    }
                },
                err => {
                    console.log(err);
                });
        } catch (err) {
            console.log(err);
        }
    }

    // Close Session
    async closeGoogleSession() {
        try {
            console.log('Google Logout Succesfull');
            await this.google.logout();
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
