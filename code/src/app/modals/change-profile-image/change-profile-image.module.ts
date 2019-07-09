import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ChangeProfileImagePage } from './change-profile-image.page';
import { SmComponentsModule } from '../../components/sm-components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SmComponentsModule
  ],
  declarations: [ChangeProfileImagePage]
})
export class ChangeProfileImagePageModule {}
