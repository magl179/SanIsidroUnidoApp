import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SocialProblemsPage } from './social-problems.page';

import { SmComponentsModule } from 'src/app/components/sm-components.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { ImageDetailPage } from 'src/app/modals/image_detail/image_detail.page';
import { ImageDetailPageModule } from "src/app/modals/image_detail/image_detail.module";
import { FilterPage } from "../../../modals/filter/filter.page";
import { SearchPage } from 'src/app/modals/search/search.page';
import { FilterPageModule } from "../../../modals/filter/filter.module";
import { SearchPageModule } from "../../../modals/search/search.module";
const routes: Routes = [
  {
    path: '',
    component: SocialProblemsPage
  }
];

@NgModule({
    entryComponents: [
        ImageDetailPage,
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
      ImageDetailPageModule,
      FilterPageModule,
    SearchPageModule
  ],
  declarations: [SocialProblemsPage]
})
export class SocialProblemsPageModule {}
