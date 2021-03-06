import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { HomeScreenPage } from './home-screen.page';
import { SmComponentsModule } from 'src/app/components/sm-components.module';

const routes: Routes = [
  {
    path: '',
    component: HomeScreenPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    SmComponentsModule
  ],
  declarations: [HomeScreenPage]
})
export class HomeScreenPageModule {}
