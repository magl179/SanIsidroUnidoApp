import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { EmergenciesPage } from './emergencies.page';
import { SmComponentsModule } from "../../../components/sm-components.module";
import { PipesModule } from "../../../pipes/pipes.module";
import { FilterPage } from "../../../modals/filter/filter.page";
import { FilterPageModule } from "../../../modals/filter/filter.module";
import { SearchPage } from "../../../modals/search/search.page";
import { SearchPageModule } from "../../../modals/search/search.module";

const routes: Routes = [
  {
    path: '',
    component: EmergenciesPage
  }
];

@NgModule({
    entryComponents: [
        FilterPage,
        SearchPage
    ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
        SmComponentsModule,
      PipesModule,
      FilterPageModule,
    SearchPageModule
  ],
  declarations: [EmergenciesPage]
})
export class EmergenciesPageModule {}
