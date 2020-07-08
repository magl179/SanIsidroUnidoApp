import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { NavController } from '@ionic/angular';
import { CONFIG } from 'src/config/config';


@Injectable({
    providedIn: 'root'
})
export class UserIsLoggedGuard implements CanActivate {

    constructor(
        private authService: AuthService,
        private navCtrl: NavController
    ) {

    }

    async canActivate(): Promise<boolean> {
        const token = await this.authService.isAuthenticated();
        if(token){
            this.navCtrl.navigateRoot(`/${CONFIG.HOME_ROUTE}`)
            return false;
        }else{
            return true
        }
    }
}
