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
    }

}
