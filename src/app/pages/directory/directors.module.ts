import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DirectoryListPage } from './directory-list/directory-list.page';
import { Routes, RouterModule } from '@angular/router';
import { SmComponentsModule } from '../../components/sm-components.module';
import { IonicModule } from '@ionic/angular';


const routes: Routes = [
    {
        path: '',
        component: DirectoryListPage
    }
];

@NgModule({
  declarations: [DirectoryListPage],
  imports: [
      CommonModule,
      IonicModule,
      RouterModule.forChild(routes),
      SmComponentsModule
  ]
})
export class DirectorsModule { }
