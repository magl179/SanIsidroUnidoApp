import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SearchPostsPage } from './search-posts.page';
import { SmComponentsModule } from '../../components/sm-components.module';

const routes: Routes = [
  {
    path: '',
    component: SearchPostsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
        IonicModule,
    SmComponentsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [SearchPostsPage]
})
export class SearchPostsPageModule {}
