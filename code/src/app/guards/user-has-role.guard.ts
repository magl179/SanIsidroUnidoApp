import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot} from '@angular/router';
import { CanActivate, CanLoad } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { hasRoles } from "src/app/helpers/user-helper";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
})
export class UserHasRoleGuard implements CanLoad {

    constructor(
        private navCtrl: NavController,
        private authService: AuthService
    ) { }

    async canLoad(): Promise<boolean> {
        const tokenDecoded = await this.authService.getTokenUserAuthenticated();
        const hasRole = hasRoles(tokenDecoded, environment.roles_permitidos_reportar);
        if (hasRole) {
            return true;
        } else {
            this.navCtrl.navigateRoot('/home');
            return false;
        }
    }

}
