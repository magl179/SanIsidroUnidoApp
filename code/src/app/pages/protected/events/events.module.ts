import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { EventsPage } from './events.page';
import { SmComponentsModule } from 'src/app/components/sm-components.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { SearchPage } from "../../../modals/search/search.page";
import { SearchPageModule } from "../../../modals/search/search.module";


const routes: Routes = [
  {
    path: '',
    component: EventsPage
  }
];

@NgModule({
    entryComponents: [
        SearchPage
    ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
        SmComponentsModule,
        PipesModule,
        SearchPageModule,
  ],
  declarations: [EventsPage]
})
export class EventsPageModule {}
