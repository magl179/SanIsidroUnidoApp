import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ReportsPage } from './reports.page';
import { SmComponentsModule } from "src/app/components/sm-components.module";
import { PipesModule } from "src/app/pipes/pipes.module";
import { NgFallimgModule } from 'ng-fallimg';


const routes: Routes = [
  {
    path: '',
    component: ReportsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
        SmComponentsModule,
        PipesModule,
    NgFallimgModule
  ],
  declarations: [ReportsPage]
})
export class ReportsPageModule {}
