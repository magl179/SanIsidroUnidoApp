import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { FrequentQuestionsPage } from './frequent-questions.page';
import { SmComponentsModule } from "../../components/sm-components.module";

const routes: Routes = [
  {
    path: '',
    component: FrequentQuestionsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
        RouterModule.forChild(routes),
        SmComponentsModule,
  ],
  declarations: [FrequentQuestionsPage]
})
export class FrequentQuestionsPageModule {}
