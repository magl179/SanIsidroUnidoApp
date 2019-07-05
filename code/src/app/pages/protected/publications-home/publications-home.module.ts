import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PublicationsHomePage } from './publications-home.page';
import { SmComponentsModule } from '../../../components/sm-components.module';



const routes: Routes = [
  {
    path: '',
    component: PublicationsHomePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    SmComponentsModule
  ],
  declarations: [PublicationsHomePage]
})
export class PublicationsHomePageModule {}
