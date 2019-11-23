import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { DirectoryListPage } from './directory-list.page';

import { SmComponentsModule } from 'src/app/components/sm-components.module';
import { NgFallimgModule } from "ng-fallimg";

const routes: Routes = [
  {
    path: '',
    component: DirectoryListPage
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
  declarations: [DirectoryListPage]
})
export class DirectoryListPageModule {}
