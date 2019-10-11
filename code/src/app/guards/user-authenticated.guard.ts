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

    async canLoad(): Promise<boolean> {
        // const userObservable = this.authService.isAuthenticated();
        const tokenDecoded = await this.authService.isAuthenticated();
        // console.log('user auth guard', tokenDecoded);
        if (tokenDecoded) {
            console.warn('existe token can load');
            return true;
        } else {
            console.log('redirect to login no existe token');
            this.router.navigate(['/login']);
            return false;
        }
        // return new Promise(async (resolve, reject) => {
        //     const tokenDecoded = await this.authService.isAuthenticated();
        //     if (tokenDecoded) {
        //         console.warn('can load', tokenDecoded);
        //         resolve(true);
        //     } else {
        //         console.log('redirect to login');
        //         this.router.navigate(['/login']);
        //         // this.authService.logout();
        //         reject(false);
        //     }
        // });
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
