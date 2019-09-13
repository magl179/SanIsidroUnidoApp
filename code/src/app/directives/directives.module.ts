import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HasRoleDirective } from './has-role.directive';
import { HasDeviceDirective } from './has-device.directive';
import { IsJsonValidDirective } from './is-json-valid.directive';

@NgModule({
  declarations: [HasRoleDirective, HasDeviceDirective, IsJsonValidDirective],
  imports: [
    CommonModule
    ],
    exports: [
        HasRoleDirective,
        HasDeviceDirective
  ]
})
export class DirectivesModule { }
