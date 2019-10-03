import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
// import { isAuthenticated } from '../helpers/auth-helper';
// import { Observable } from 'rxjs';
// import { map, take } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class UserNotAuthenticatedGuard implements CanActivate {

    constructor(
        private authService: AuthService,
        private router: Router
        ) {

    }

    canActivate(): Observable<boolean> | boolean {

        const userObservable = this.authService.sessionAuthUser;
        return userObservable.pipe(
            map(token_decoded => {
                console.log('token decoded user not authenticated guard', token_decoded);
              if(token_decoded) {
                this.router.navigate(['/home']);
                return false;
              } else {
                return false;
              }
            })
          );
    }
}
