import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PublicServiceDetailPage } from './public-service-detail.page';
import { PipesModule } from "../../pipes/pipes.module";
import { SmComponentsModule } from "../../components/sm-components.module";

const routes: Routes = [
  {
    path: '',
    component: PublicServiceDetailPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
        RouterModule.forChild(routes),
        PipesModule,
    SmComponentsModule
  ],
  declarations: [PublicServiceDetailPage]
})
export class PublicServiceDetailPageModule {}
