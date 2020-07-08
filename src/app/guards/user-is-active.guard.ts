import { Injectable } from '@angular/core';
import { CanActivate } from "@angular/router";
import { Observable } from 'rxjs';
import { AuthService } from "src/app/services/auth.service";
import { map, take } from 'rxjs/operators';
import { isRolActive } from '../helpers/utils';
import { MessagesService } from '../services/messages.service';

@Injectable({
    providedIn: 'root'
})

export class UserIsActiveGuard implements CanActivate {

    constructor(
        private authService: AuthService,
        private messagesService: MessagesService
    ) {
    }

    canActivate(): Observable<boolean> {
        const userObservable = this.authService.sessionAuthUser;
        return userObservable.pipe(
            map(token_decoded => {
                let isActive = false;
                if (!token_decoded || !token_decoded.user || token_decoded.user.roles) {
                    isActive = false;
                }
                const roles = token_decoded.user.roles.filter(rol => rol.slug == 'morador' || rol.slug == 'invitado' || rol.slug == 'policia');
                isActive =isRolActive(roles);
                if(!isActive){
                    this.messagesService.showInfo('Usuario no tiene permisos, por favor contactese con el administrador')
                    setTimeout(()=>{
                        this.authService.logout();
                        return false
                    }, 1000)
                }
                return true
            }),
            take(1)
        );
    }
}
