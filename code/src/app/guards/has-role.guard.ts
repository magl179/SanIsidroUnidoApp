import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot} from '@angular/router';
import { CanActivate } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class HasRoleGuard implements CanActivate {

    constructor(
        private navCtrl: NavController,
        private authService: AuthService
    ) { }

    canActivate(route: ActivatedRouteSnapshot): boolean {
        const roles = route.data.roles as Array<string>;
        if (this.authService.hasRoles(roles)) {
            console.log('User has roles', roles);
            return true;
        } else {
            console.log('user not has roles', roles);
            this.navCtrl.navigateRoot('/home');
            return false;
        }
    }

}
