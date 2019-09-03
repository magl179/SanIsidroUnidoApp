import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate } from "@angular/router";
import { Observable } from 'rxjs';
import { AuthService } from "../services/auth.service";
import { NavController } from "@ionic/angular";

@Injectable({
  providedIn: 'root'
})

export class IsActiveGuard implements CanActivate {

    constructor(
        private authService: AuthService,
        private navCtrl: NavController
        ) {
    }

    async canActivate() {
        const userIsActive = await this.authService.isActive();
        
        if (userIsActive) {
            return true;
        } else {
            this.authService.removeAuthInfo();
            this.navCtrl.navigateRoot('/login');
            return false;
        }
    }
}
