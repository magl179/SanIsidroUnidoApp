import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NavController } from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class NoLoginAuthGuard implements CanActivate {

    constructor(
        private authService: AuthService,
        private navCtrl: NavController
        ) {

    }

    async canActivate() {
        const isAuthenticated = await this.authService.isAuthenticated();
        // console.log({tengo_auth: isAuthenticated});
        if (isAuthenticated === true) {
            this.navCtrl.navigateRoot('/home');
            return false;
        }
        return true;
    }
}
