import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { NavController } from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class UserAuthenticatedGuard implements CanLoad {

    constructor(
        private authService: AuthService,
        private router: Router,
        private navCtrl: NavController
    ) {

    }

    async canLoad(): Promise<boolean> {
        const tokenDecoded = await this.authService.isAuthenticated();
        if (tokenDecoded) {
            return true;
        } else {
            this.navCtrl.navigateBack(`/home-screen`)
            return false;
        }
    }

}
