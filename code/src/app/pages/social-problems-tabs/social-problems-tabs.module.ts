import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SocialProblemsTabsPage } from './social-problems-tabs.page';

const routes: Routes = [
    {
        path: '',
        component: SocialProblemsTabsPage,
        children: [
            {
                path: 'list',
                loadChildren: "../social-problems-categories/social-problems.module#SocialProblemsCategoriesPageModule"
            },
            {
                path: 'report',
                loadChildren: "../social-problem-create/social-problem-create.module#SocialProblemCreatePageModule"
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
    declarations: [SocialProblemsTabsPage]
})
export class SocialProblemsTabsPageModule { }
