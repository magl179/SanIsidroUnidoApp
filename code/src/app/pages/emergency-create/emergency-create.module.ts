import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { EmergencyCreatePage } from './emergency-create.page';
import { SmComponentsModule } from 'src/app/components/sm-components.module';
import {PipesModule} from 'src/app/pipes/pipes.module';



const routes: Routes = [
  {
    path: '',
    component: EmergencyCreatePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
        SmComponentsModule,
        ReactiveFormsModule,
        PipesModule
  ],
  declarations: [EmergencyCreatePage]
})
export class EmergencyCreatePageModule {}
