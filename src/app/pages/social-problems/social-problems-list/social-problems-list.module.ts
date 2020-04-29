import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { SocialProblemsListPage } from './social-problems-list.page';
import { SmComponentsModule } from 'src/app/components/sm-components.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { ImageDetailPage } from 'src/app/modals/image_detail/image_detail.page';
import { ImageDetailPageModule } from "src/app/modals/image_detail/image_detail.module";
import { FilterPage } from "src/app/modals/filter/filter.page";
import { SearchPage } from 'src/app/modals/search/search.page';
import { FilterPageModule } from "src/app/modals/filter/filter.module";
import { SearchPageModule } from "src/app/modals/search/search.module";
import { NgFallimgModule } from 'ng-fallimg';

const routes: Routes = [
    {
        path: '',
        component: SocialProblemsListPage
    },
    
];

@NgModule({
    entryComponents: [
        ImageDetailPage,
        FilterPage,
        SearchPage
    ],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild(routes),
        SmComponentsModule,
        PipesModule,
        ImageDetailPageModule,
        FilterPageModule,
        SearchPageModule,
        ReactiveFormsModule,
        NgFallimgModule
    ],
    declarations: [SocialProblemsListPage]
})
export class SocialProblemsListPageModule { }
