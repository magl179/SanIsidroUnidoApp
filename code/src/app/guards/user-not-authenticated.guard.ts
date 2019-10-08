import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class UserNotAuthenticatedGuard implements CanActivate {

    constructor(
        private authService: AuthService,
        private router: Router
        ) {

    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {

        const userObservable = this.authService.sessionAuthUser;

        return userObservable.pipe(
            map(token_decoded => {
                console.log('token decoded user not authenticated guard', token_decoded);
                console.log('url previous', state.url);
              if(token_decoded) {
                this.router.navigate(['/home']);
                return false;
              } else {
                return true;
              }
            })
          );
    }
}
