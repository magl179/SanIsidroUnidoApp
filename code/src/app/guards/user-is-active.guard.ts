import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate, Router } from "@angular/router";
import { Observable } from 'rxjs';
import { AuthService } from "src/app/services/auth.service";
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class UserIsActiveGuard implements CanActivate {

    constructor(
        private authService: AuthService,
        private router: Router
        ) {
    }

    canActivate():Observable<boolean> | boolean {
        const userObservable = this.authService.sessionAuthUser;
        // console.log('login guard');
        return userObservable.pipe(
            map(token_decoded => {
                console.log('token decoded user authenticated guard', token_decoded);
                if (token_decoded) {
                    if (token_decoded.user && token_decoded.user.roles && token_decoded.user.roles[0].role_user.state === 1) {
                        return true;
                    }
                    return false;
                } else {
                    this.router.navigate(['/login']);
                    return false;
                }
            })
        );
    }
}
