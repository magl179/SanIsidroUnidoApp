import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { EditProfilePage } from './edit-profile.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
        ReactiveFormsModule
  ],
  declarations: [EditProfilePage]
})
export class EditProfilePageModule {}
