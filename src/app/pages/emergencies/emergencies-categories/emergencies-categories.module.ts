import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { EmergenciesCategoriesPage } from './emergencies-categories.page';
import { SmComponentsModule } from "src/app/components/sm-components.module";
import { PipesModule } from "src/app/pipes/pipes.module";
import { DirectivesModule } from "src/app/directives/directives.module";

const routes: Routes = [
  {
    path: '',
    component: EmergenciesCategoriesPage
  }
];

@NgModule({
    entryComponents: [
    ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
        SmComponentsModule,
      PipesModule,
      DirectivesModule,
      ReactiveFormsModule
  ],
  declarations: [EmergenciesCategoriesPage]
})
export class EmergenciesCategoriesPageModule {}
