import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NavController } from '@ionic/angular';
import { take, map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class LoginAuthGuard implements CanActivate {

    constructor(
        private authService: AuthService,
        private navCtrl: NavController
        ) {

    }

    async canActivate() {
        const userAuthenticated = await this.authService.isAuthenticated();
        console.log('login auth', userAuthenticated);
        if (!userAuthenticated) {
            this.navCtrl.navigateRoot('/login');
            return false;
        } else {
            return true;
        }
        // const isAuthenticated = await this.authService.isAuthenticated();
        // // console.log({tengo_auth: isAuthenticated});
        // if (isAuthenticated === false) {
        //     this.navCtrl.navigateRoot('/login');
        //     return false;
        // }
        // return true;
        // this.authService.verificarAuthInfo();
        // return this.authService.getAuthUser().pipe(
        //     take(1),
        //     map(user => {
        //         if (user) {
        //             return true;
        //         } else {
        //             this.navCtrl.navigateRoot('/home');
        //             return false;
        //         }
        //     })
        // );
    }
}
