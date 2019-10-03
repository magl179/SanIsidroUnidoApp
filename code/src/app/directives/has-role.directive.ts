import { Directive, Input, TemplateRef, ViewContainerRef, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { hasRoles } from '../helpers/user-helper';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Directive({
    selector: '[appHasRole]'
})
export class HasRoleDirective implements OnInit {

    @Input('appHasRole') roles: string[];
    authObservable$: Subscription;
    isVisible = false;

    // isVisible = false;

    constructor(
        private authService: AuthService,
        private templateRef: TemplateRef<any>,
        private viewContainer: ViewContainerRef
    ) { }

    // async ngOnInit() {
    //     // console.log('Llamado Has Role directive with roles:', this.roles);
    //     const hasRole = await hasRoles(this.sessionAuth, this.roles);
    //     // console.log('user has role', hasRole);
    //     // console.log('roles permitidos', this.roles);
    //     console.log('has role', hasRole);
    //     if (hasRole) {
    //         this.viewContainer.createEmbeddedView(this.templateRef);
    //     } else {
    //         this.viewContainer.clear();
    //     }
    // }
    ngOnInit() {
        //  We subscribe to the roles$ to know the roles the user has
        this.authObservable$ = this.authService.sessionAuthUser.subscribe(token_decoded => {
          // If he doesn't have any roles, we clear the viewContainerRef
            // console.log('has role token decoded', token_decoded);
          if (!token_decoded) {
            this.viewContainer.clear();
          }
          // If the user has the role needed to 
          // render this component we can add it
            if (hasRoles(token_decoded, this.roles)) {
                if (!this.isVisible) {
                    this.isVisible = true;
                    // console.log('has roles directive', this.roles)
                    this.viewContainer.createEmbeddedView(this.templateRef);
                }
            // }
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
