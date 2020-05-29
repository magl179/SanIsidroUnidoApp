import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SocialEmailLoginModal } from './social-email-login.modal';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SmComponentsModule } from 'src/app/components/sm-components.module';

@NgModule({
  declarations: [SocialEmailLoginModal],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    SmComponentsModule,
  ]
})
export class SocialEmailLoginModule { }
