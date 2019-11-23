import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MapInfoPage } from './map-info.page';


@NgModule({
  imports: [
    CommonModule,
    // FormsModule,
    IonicModule,
        // ReactiveFormsModule
  ],
  declarations: [MapInfoPage]
})
export class MapInfoPageModule {}
