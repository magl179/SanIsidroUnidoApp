import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HasRoleDirective } from './has-role.directive';
import { DeviceUserIsRegisterDirective } from './has-device.directive';
import { CanRequestMembershipDirective } from './can-request-membership.directive';

@NgModule({
  declarations: [HasRoleDirective, DeviceUserIsRegisterDirective, CanRequestMembershipDirective,],
  imports: [
    CommonModule
    ],
    exports: [
        HasRoleDirective,
        DeviceUserIsRegisterDirective,
        CanRequestMembershipDirective
  ]
})
export class DirectivesModule { }
