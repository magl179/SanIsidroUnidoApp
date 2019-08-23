import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

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
        const userAuthenticated = await this.authService.isAuthenticated();
        // console.log('login auth', userAuthenticated);
        if (userAuthenticated) {
            this.navCtrl.navigateRoot('/home');
            return false;
        } else {
            return true;
        }
    }
}
