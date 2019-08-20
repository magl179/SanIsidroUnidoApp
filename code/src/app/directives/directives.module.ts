import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HasRoleDirective } from './has-role.directive';
import { HasDeviceDirective } from './has-device.directive';

@NgModule({
  declarations: [HasRoleDirective, HasDeviceDirective],
  imports: [
    CommonModule
    ],
    exports: [
        HasRoleDirective,
        HasDeviceDirective
  ]
})
export class DirectivesModule { }
