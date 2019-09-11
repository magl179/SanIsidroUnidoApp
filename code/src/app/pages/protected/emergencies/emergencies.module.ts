import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { EmergenciesPage } from './emergencies.page';
import { SmComponentsModule } from "../../../components/sm-components.module";

const routes: Routes = [
  {
    path: '',
    component: EmergenciesPage
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
  declarations: [EmergenciesPage]
})
export class EmergenciesPageModule {}
