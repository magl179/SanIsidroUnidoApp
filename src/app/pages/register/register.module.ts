import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { RegisterPage } from './register.page';
import { SmComponentsModule } from 'src/app/components/sm-components.module';
import { SocialEmailLoginModal } from 'src/app/modals/social-email-login/social-email-login.modal';
import { SocialEmailLoginModule } from 'src/app/modals/social-email-login/social-email-login.module';
import { MatIconModule } from '@angular/material/icon';

const routes: Routes = [
  {
    path: '',
    component: RegisterPage
  }
];

@NgModule({
  entryComponents: [
    SocialEmailLoginModal
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MatIconModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    SmComponentsModule,
    SocialEmailLoginModule
  ],
  declarations: [RegisterPage]
})
export class RegisterPageModule {}
