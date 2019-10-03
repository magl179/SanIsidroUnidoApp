import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ReportDetailPage } from './report-detail.page';
import { SmComponentsModule } from "src/app/components/sm-components.module";
import { PipesModule } from "src/app/pipes/pipes.module";

const routes: Routes = [
  {
    path: '',
    component: ReportDetailPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
        RouterModule.forChild(routes),
        SmComponentsModule,
    PipesModule
  ],
  declarations: [ReportDetailPage]
})
export class ReportDetailPageModule {}
