import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SocialProblemCreatePage } from './social-problem-create.page';

import { SmComponentsModule } from 'src/app/components/sm-components.module';
import { ReactiveFormsModule } from '@angular/forms';


const routes: Routes = [
  {
    path: '',
    component: SocialProblemCreatePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    SmComponentsModule,
    ReactiveFormsModule
  ],
  declarations: [SocialProblemCreatePage]
})
export class SocialProblemCreatePageModule {}
