import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SocialProblemDetailPage } from './social-problem-detail.page';

import { SmComponentsModule } from 'src/app/components/sm-components.module';
import { PipesModule } from '../../../pipes/pipes.module';
import { ImageDetailPage } from 'src/app/modals/image_detail/image_detail.page';
import { ImageDetailPageModule } from "../../../modals/image_detail/image_detail.module";
import { NgFallimgModule } from 'ng-fallimg';

const routes: Routes = [
  {
    path: '',
    component: SocialProblemDetailPage
  }
];

@NgModule({
    entryComponents: [
        ImageDetailPage
    ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
        SmComponentsModule,
      PipesModule,
      ImageDetailPageModule,
    NgFallimgModule
  ],
  declarations: [SocialProblemDetailPage]
})
export class SocialProblemDetailPageModule {}
