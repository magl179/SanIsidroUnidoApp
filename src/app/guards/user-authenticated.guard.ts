import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { NavController } from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class UserAuthenticatedGuard implements CanActivate {

    constructor(
        private authService: AuthService,
        private navCtrl: NavController
    ) {

    }

    async canActivate(): Promise<boolean> {
        const tokenDecoded = await this.authService.isAuthenticated();
        console.log('tokenDecoded',)
        if (tokenDecoded) {
            return true;
        } else {
            this.navCtrl.navigateRoot(`/home-screen`)
            return false;
        }
    }

}
