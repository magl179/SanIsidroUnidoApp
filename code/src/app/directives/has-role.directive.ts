import { Directive, Input, TemplateRef, ViewContainerRef, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Directive({
    selector: '[appHasRole]'
})
export class HasRoleDirective implements OnInit {

    @Input('appHasRole') roles: string[];

    constructor(
        private authService: AuthService,
        private templateRef: TemplateRef<any>,
        private viewContainer: ViewContainerRef
    ) { }

    ngOnInit() {
        console.log('Llamado Has Role directive with roles:', this.roles);
        if (this.authService.hasRoles(this.roles)) {
            this.viewContainer.createEmbeddedView(this.templateRef);
        } else {
            this.viewContainer.clear();
        }
    }

}
