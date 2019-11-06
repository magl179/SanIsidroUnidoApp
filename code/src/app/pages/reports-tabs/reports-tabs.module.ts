import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ReportsTabsPage } from './reports-tabs.page';

const routes: Routes = [
    {
        path: '',
        component: ReportsTabsPage,
        children: [
            {
                path: 'list',
                loadChildren: "../reports/reports.module#SocialProblemsCategoriesPageModule"
            }
        ]
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild(routes)
    ],
    declarations: [ReportsTabsPage]
})
export class ReportsTabsPageModule { }
