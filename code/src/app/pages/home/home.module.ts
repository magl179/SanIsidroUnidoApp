import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { HomePage } from './home.page';
import { SmComponentsModule } from '../../components/sm-components.module';
import { DirectivesModule } from '../../directives/directives.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomePage
      }
    ]),
        SmComponentsModule,
        DirectivesModule
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
