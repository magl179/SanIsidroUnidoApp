import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SearchPage } from './search.page';
import { SmComponentsModule } from 'src/app/components/sm-components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SmComponentsModule
  ],
  declarations: [SearchPage]
})
export class SearchPageModule {}
