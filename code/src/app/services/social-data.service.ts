import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class SocialDataService {

    constructor(
        private http: HttpClient
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
            avatar: googleUser.image.url
        };
        return appUser;
    }

    getOwnFacebookUser(fbUser: any) {
        const appUser = {
            firstname: fbUser.first_name,
            lastname: fbUser.last_name,
            email: fbUser.email,
            token_id: fbUser.id,
            provider: 'facebook',
            avatar: fbUser.image
        };
        return appUser;
    }
}
