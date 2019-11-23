import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ReportsListPage } from './reports-list.page';
import { SmComponentsModule } from "src/app/components/sm-components.module";
import { PipesModule } from "src/app/pipes/pipes.module";
import { NgFallimgModule } from 'ng-fallimg';


const routes: Routes = [
    {
        path: '',
        component: ReportsListPage
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild(routes),
        SmComponentsModule,
        PipesModule,
        NgFallimgModule
    ],
    declarations: [ReportsListPage]
})
export class ReportsListPageModule { }
