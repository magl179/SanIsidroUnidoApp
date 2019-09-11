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
        
        if (!userAuthenticated) {
            this.authService.removeAuthInfo();
            this.navCtrl.navigateRoot('/tutorial');
            return false;
        } else {
            return true;
        }
    }
    
}
