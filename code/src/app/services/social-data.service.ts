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

    getGoogleDataParsed(googleUser: any) {
        //console.log('google user', googleUser);
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

    // LOGIN SOCIAL
    async loginByGoogle() {
        if (this.platform.is('cordova')) {
            try {
                const loginGoogle = await this.google.login({});
                await this.getGoogleData(loginGoogle);
            } catch (error) {
                console.log(error);
                await this.utilsService.showToast('Error con la conexion a Google');
            }
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
            // console.log('Datos Perfil Usuario', profile);
            profile.image = `https://graph.facebook.com/${userId}/picture?type=large`;
            if (profile !== null) {
                this.fbLoginData.next(profile);
                this.closeFacebookSession();
            } else {
                this.utilsService.showToast('No se pudo obtener los datos con Facebook');
            }
        } catch (err) {
            console.log(err);
            this.utilsService.showToast('No se pudieron obtener los datos de facebook');
        }
    }

    getGoogleData(googleLogin) {
        try {
            this.http.get(`https://www.googleapis.com/plus/v1/people/me?access_token=${googleLogin.accessToken}`).subscribe(
                async (profile: any) => {
                    profile.avatar = googleLogin.imageUrl;
                    this.googleLoginData.next(profile);
                    await this.closeGoogleSession();                    
                },
                err => {
                    console.log(err);
                    this.utilsService.showToast('No se pudieron obtener los datos de Google');
                });
        } catch (err) {
            console.log(err);
            this.utilsService.showToast('No se pudieron obtener los datos de Google');
        }
    }

    // Close Session
    async closeGoogleSession() {
        try {
            await this.google.logout();
        } catch (err) {
            console.log(err);
            this.utilsService.showToast('No se pudo cerrar la sesion de Google');
        }
    }

    async closeFacebookSession() {
        try {
            await this.facebook.logout();
        } catch (err) {
            console.log(err);
            this.utilsService.showToast('No se pudo cerrar la sesion de Facebook');
        }
    }

}
