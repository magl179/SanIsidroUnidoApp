import { Directive, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ITokenDecoded } from '../interfaces/models';

@Directive({
  selector: '[appCanRequestMembership]'
})
export class CanRequestMembershipDirective implements OnInit {

  isVisible = false;

  constructor(
    private authService: AuthService,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) { }

  ngOnInit() {
    this.authService.sessionAuthUser.subscribe((token_decoded: ITokenDecoded) => {
      if (token_decoded) {
        const memberships = (token_decoded && token_decoded.user && token_decoded.user.memberships) ? token_decoded.user.memberships.filter(membership => membership.status_attendance == "aprobado") : [];

        const canMakeMembership = (memberships && memberships.length == 0) ? true : false;

        if (canMakeMembership) {
          this.isVisible = true;
          this.viewContainer.createEmbeddedView(this.templateRef);;
        } else {
          this.isVisible = false;
          this.viewContainer.clear()
        }
      } else {
        this.isVisible = false;
        this.viewContainer.clear();
      }
    });
  }

}
