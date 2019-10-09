import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { take, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UserAuthenticatedGuard implements CanLoad {

    constructor(
        private authService: AuthService,
        private router: Router
    ) {

    }

    canLoad(): Observable<boolean> | boolean {
        // const userObservable = this.authService.isAuthenticated();
        const tokenDecoded = this.authService.isAuthenticated();
        if (tokenDecoded) {
            console.log('can load');
            return true;
        } else {
            console.log('redirect to login');
            this.router.navigate(['/login']);
            // this.authService.logout();
            return false;
        }
        // console.log('login guard');
        // return userObservable.pipe(
        //     map(token_decoded => {
        //         console.log('token decoded user authenticated guard', token_decoded);
        //         if (token_decoded) {
        //             return true;
        //         } else {
        //             this.router.navigate(['/login']);
        //             this.authService.logout();
        //             return false;
        //         }
        //     })
        // );
    }

}
