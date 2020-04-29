import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { EventsListPage } from './events-list.page';
import { SmComponentsModule } from 'src/app/components/sm-components.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { SearchPage } from "src/app/modals/search/search.page";
import { SearchPageModule } from "src/app/modals/search/search.module";
import { NgFallimgModule } from 'ng-fallimg';
import { DirectivesModule } from 'src/app/directives/directives.module';


const routes: Routes = [
  {
    path: '',
    component: EventsListPage
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
        DirectivesModule,
        PipesModule,
        ReactiveFormsModule,
      SearchPageModule,
      NgFallimgModule
  ],
  declarations: [EventsListPage]
})
export class EventsListPageModule {}
