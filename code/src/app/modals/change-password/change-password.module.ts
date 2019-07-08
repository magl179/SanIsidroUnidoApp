import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ChangePasswordPage } from './change-password.page';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
        ReactiveFormsModule
  ],
  declarations: [ChangePasswordPage]
})
export class ChangePasswordPageModule {}
