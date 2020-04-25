import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

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
        if (tokenDecoded) {
            return true;
        } else {
            this.router.navigate(['/home-screen']);
            return false;
        }
    }

}
