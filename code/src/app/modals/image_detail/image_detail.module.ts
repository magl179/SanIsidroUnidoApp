import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ImageDetailPage } from './image_detail.page';
import { SmComponentsModule } from '../../components/sm-components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SmComponentsModule
  ],
  declarations: [ImageDetailPage]
})
export class ImageDetailPageModule {}
