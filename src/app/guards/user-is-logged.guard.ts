import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { NavController } from '@ionic/angular';
import { CONFIG } from 'src/config/config';

@Injectable({
    providedIn: 'root'
})
export class UserIsLoggedGuard implements CanLoad {

    constructor(
        private authService: AuthService,
        private router: Router,
        private navCtrl: NavController
    ) {

    }

    async canLoad(): Promise<boolean> {
        const tokenDecoded = await this.authService.isAuthenticated();
        if (!tokenDecoded) {
            return true;
        } else {
            this.navCtrl.navigateRoot(`/${CONFIG.HOME_ROUTE}`)
            return false;
        }
    }

}
