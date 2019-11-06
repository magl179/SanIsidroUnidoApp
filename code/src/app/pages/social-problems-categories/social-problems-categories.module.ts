import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SocialProblemsCategoriesPage } from './social-problems-categories.page';
import { SmComponentsModule } from "../../components/sm-components.module";
import { PipesModule } from "../../pipes/pipes.module";

const routes: Routes = [
  {
    path: '',
    component: SocialProblemsCategoriesPage
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
  declarations: [SocialProblemsCategoriesPage]
})
export class SocialProblemsCategoriesPageModule {}
