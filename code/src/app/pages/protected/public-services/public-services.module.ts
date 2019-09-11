import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PublicServicesPage } from './public-services.page';
import { SmComponentsModule } from 'src/app/components/sm-components.module';
import { MapInfoPageModule } from "src/app/modals/map-info/map-info.module";
import { MapInfoPage } from "src/app/modals/map-info/map-info.page";

const routes: Routes = [
  {
    path: '',
    component: PublicServicesPage
  }
];

@NgModule({
    entryComponents: [
        MapInfoPage
    ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    SmComponentsModule,
    MapInfoPageModule
  ],
  declarations: [PublicServicesPage]
})
export class PublicServicesPageModule {}
