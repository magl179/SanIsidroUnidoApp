import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { take, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UserAuthenticatedGuard implements CanActivate {

    constructor(
        private authService: AuthService,
        private router: Router
    ) {

    }

    canActivate(): Observable<boolean> | boolean {
        const userObservable = this.authService.sessionAuthUser;
        // console.log('login guard');
        return userObservable.pipe(
            map(token_decoded => {
                console.log('token decoded user authenticated guard', token_decoded);
                if (token_decoded) {
                    return true;
                } else {
                    this.router.navigate(['/login']);
                    return false;
                }
            })
        );
    }

}
