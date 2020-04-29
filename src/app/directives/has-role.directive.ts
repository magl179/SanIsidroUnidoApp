import { Directive, Input, TemplateRef, ViewContainerRef, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { hasRoles, getUserRoles } from 'src/app/helpers/user-helper';
import { Subscription } from 'rxjs';

@Directive({
    selector: '[appHasRole]'
})
export class HasRoleDirective implements OnInit {

    @Input('appHasRole') roles: string[];
    authObservable$: Subscription;
    isVisible = false;

    constructor(
        private authService: AuthService,
        private templateRef: TemplateRef<any>,
        private viewContainer: ViewContainerRef
    ) { }

    ngOnInit() {
        this.authObservable$ = this.authService.sessionAuthUser.subscribe(token_decoded => {
            // If he doesn't have any roles, we clear the viewContainerRef
            let userRoles = [];
            if (!token_decoded) {
                userRoles = ['no_autenticado'];
            }else{
                userRoles = getUserRoles(token_decoded);
            }
            // If the user has the role needed to render this component we can add it
            const userhasRoles = hasRoles(userRoles, this.roles);
            if (userhasRoles) {
                if (!this.isVisible) {
                    this.isVisible = true;
                    this.viewContainer.createEmbeddedView(this.templateRef);
                }
            } else {
                this.isVisible = false;
                // If the user does not have the role
                this.viewContainer.clear();
            }
        });
    }

    // Clear the subscription on destroy
    ngOnDestroy() {
        this.authObservable$.unsubscribe();
    }

}
