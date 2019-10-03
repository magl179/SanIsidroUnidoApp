import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { DirectoryInfoPage } from './directory-info.page';

import { SmComponentsModule } from 'src/app/components/sm-components.module';
import { NgFallimgModule } from "ng-fallimg";

const routes: Routes = [
  {
    path: '',
    component: DirectoryInfoPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
        SmComponentsModule,
    NgFallimgModule
  ],
  declarations: [DirectoryInfoPage]
})
export class DirectoryInfoPageModule {}
