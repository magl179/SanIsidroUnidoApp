import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { EmergenciesListPage } from './emergencies-list.page';
import { SmComponentsModule } from "src/app/components/sm-components.module";
import { PipesModule } from "src/app/pipes/pipes.module";
import { FilterPage } from "src/app/modals/filter/filter.page";
import { FilterPageModule } from "src/app/modals/filter/filter.module";
import { SearchPage } from "src/app/modals/search/search.page";
import { SearchPageModule } from "src/app/modals/search/search.module";
import { NgFallimgModule } from 'ng-fallimg';
import { DirectivesModule } from "src/app/directives/directives.module";

const routes: Routes = [
  {
    path: '',
    component: EmergenciesListPage
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
      DirectivesModule,
      ReactiveFormsModule,
      SearchPageModule,
      NgFallimgModule
  ],
  declarations: [EmergenciesListPage]
})
export class EmergenciesListPageModule {}
