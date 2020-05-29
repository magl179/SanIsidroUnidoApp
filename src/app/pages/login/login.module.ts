import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { LoginPage } from './login.page';
import { ReactiveFormsModule } from '@angular/forms';
import { SmComponentsModule } from 'src/app/components/sm-components.module';
import { SocialEmailLoginModal } from 'src/app/modals/social-email-login/social-email-login.modal';
import { SocialEmailLoginModule } from 'src/app/modals/social-email-login/social-email-login.module';

const routes: Routes = [
  {
    path: '',
    component: LoginPage
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
        RouterModule.forChild(routes),
        ReactiveFormsModule,
        SmComponentsModule,
        SocialEmailLoginModule
  ],
  declarations: [LoginPage]
})
export class LoginPageModule {}
