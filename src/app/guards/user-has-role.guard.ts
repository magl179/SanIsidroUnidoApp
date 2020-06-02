import { Injectable } from '@angular/core';
import { CanLoad } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { hasRoles } from "src/app/helpers/user-helper";
import { CONFIG } from 'src/config/config';
import { getUserRoles } from 'src/app/helpers/user-helper';
import { ITokenDecoded } from '../interfaces/models';

@Injectable({
    providedIn: 'root'
})
export class UserHasRoleGuard implements CanLoad {

    constructor(
        private navCtrl: NavController,
        private authService: AuthService
    ) { }

    async canLoad(): Promise<boolean> {
        const tokenDecoded: ITokenDecoded = await this.authService.getTokenUserAuthenticated();
        const roles = getUserRoles(tokenDecoded);
        const hasRole = hasRoles(roles, CONFIG.ALLOWED_ROLES_REPORT);
        if (hasRole) {
            return true;
        } else {
            this.navCtrl.navigateRoot('/home');
            return false;
        }
    }

}
