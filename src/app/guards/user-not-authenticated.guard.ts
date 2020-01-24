import { Injectable } from '@angular/core';
import { CanActivate, CanLoad,  Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class UserNotAuthenticatedGuard implements CanLoad {

    constructor(
        private authService: AuthService,
        private router: Router
        ) {

    }

    canLoad(): Observable<boolean> | boolean {

        const userObservable = this.authService.sessionAuthUser;

        return userObservable.pipe(
            map(token_decoded => {
            // console.log('token decoded user not authenticated guard', token_decoded);
              if(token_decoded) {
                this.router.navigate(['/home']);
                return false;
              } else {
                  this.router.navigate(['/tutorial']);
                  return false;
              }
            })
          );
    }
}
