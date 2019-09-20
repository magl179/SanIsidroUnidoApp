// import { Directive } from '@angular/core';

// @Directive({
//   selector: '[appIsJsonValid]'
// })
// export class IsJsonValidDirective {

//   constructor() { }

// }

import { Directive, Input, TemplateRef, ViewContainerRef, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Directive({
    selector: '[appHasRole]'
})
export class IsJsonValidDirective implements OnInit {

    @Input('isJsonValid') json: any;

    constructor(
        // private authService: AuthService,
        private templateRef: TemplateRef<any>,
        private viewContainer: ViewContainerRef
    ) { }

    async ngOnInit() {
        // console.log('Llamado Has Role directive with roles:', this.roles);
        // const hasRole = await this.authService.hasRoles(this.roles);
        // console.log('user has role', hasRole);
        // console.log('roles permitidos', this.roles);
        //console.log('has role', hasRole);
        //if (hasRole) {
            this.viewContainer.createEmbeddedView(this.templateRef);
        // } else {
        //     this.viewContainer.clear();
        // }
    }

}
