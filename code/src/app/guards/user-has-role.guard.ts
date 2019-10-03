import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot} from '@angular/router';
import { CanActivate } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { hasRoles } from "src/app/helpers/user-helper";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
})
export class UserHasRoleGuard implements CanActivate {

    constructor(
        private navCtrl: NavController,
        private authService: AuthService
    ) { }

    canActivate(route: ActivatedRouteSnapshot): boolean {

        if (hasRoles(this.authService.sessionAuthUserSubject.value, environment.roles_permitidos_reportar)) {
            // console.log('User has roles', roles);
            return true;
        } else {
            // console.log('user not has roles', roles);
            this.navCtrl.navigateRoot('/home');
            return false;
        }
    }

}
