import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HomeListPage } from './home-list.page';
import { SmComponentsModule } from 'src/app/components/sm-components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomeListPage
      }
    ]),
    DirectivesModule,
    SmComponentsModule
  ],
  declarations: [HomeListPage]
})
export class HomeListPageModule {}
