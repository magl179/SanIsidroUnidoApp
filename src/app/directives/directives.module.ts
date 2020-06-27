import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HasRoleDirective } from './has-role.directive';
import { HasDeviceDirective } from './has-device.directive';
import { CanRequestMembershipDirective } from './can-request-membership.directive';

@NgModule({
  declarations: [HasRoleDirective, HasDeviceDirective, CanRequestMembershipDirective],
  imports: [
    CommonModule
    ],
    exports: [
        HasRoleDirective,
        HasDeviceDirective,
        CanRequestMembershipDirective
  ]
})
export class DirectivesModule { }
