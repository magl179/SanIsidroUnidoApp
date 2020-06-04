import { Injectable } from '@angular/core';
import { CanLoad, Router } from "@angular/router";
import { Observable } from 'rxjs';
import { AuthService } from "src/app/services/auth.service";
import { map } from 'rxjs/operators';
import { isRolActive } from '../helpers/utils';

@Injectable({
    providedIn: 'root'
})

export class UserIsActiveGuard implements CanLoad {

    constructor(
        private authService: AuthService,
        private router: Router
    ) {
    }

    canLoad(): Observable<boolean> | boolean {
        const userObservable = this.authService.sessionAuthUser;
        return userObservable.pipe(
            map(token_decoded => {
                if (token_decoded) {
                    if (token_decoded.user && token_decoded.user.roles) {
                        const roles = token_decoded.user.roles.filter(rol => rol.slug == 'morador' || rol.slug == 'invitado' || rol.slug == 'policia');
                        console.log('roles', roles)
                        const activeRol = isRolActive(roles);
                        console.log('activeRol', activeRol)
                        if (!activeRol) {
                            this.authService.logout();
                            return false;
                            return true;
                        }
                        return true;
                    }
                    return false;
                } else {
                    this.authService.logout();
                    return false;
                    // return true;
                    // this.router.navigate(['/home-screen']);
                }
            })
        );
    }
}
