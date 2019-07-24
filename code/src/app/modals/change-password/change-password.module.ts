import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ChangePasswordPage } from './change-password.page';
import { ReactiveFormsModule } from '@angular/forms';
import { SmComponentsModule } from 'src/app/components/sm-components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    SmComponentsModule
  ],
  declarations: [ChangePasswordPage]
})
export class ChangePasswordPageModule {}
