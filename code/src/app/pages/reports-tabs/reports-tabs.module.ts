import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ReportsTabsPage } from './reports-tabs.page';
import { environment } from 'src/environments/environment';
import { UserAuthenticatedGuard } from 'src/app/guards/user-authenticated.guard';

const routes: Routes = [
    {
        path: '',
        component: ReportsTabsPage,
        children: [
            {                path: 'list',
                loadChildren: "src/app/pages/reports/reports.module#ReportsPageModule"
            },
            {
                path: 'search',
                loadChildren: "src/app/pages/search-posts/search-posts.module#SearchPostsPageModule",
                data: {
                    searchIdeas: ['ferguson', 'Manual', 'Byron', 'Calderon', 'Lolita'],
                    searchPlaceholder: 'Buscar Informes',
                    searchRouteDetail: '/reports-tabs/detail',
                    searchSlug: environment.reportsSlug
                }

            },
            {
                path: 'detail/:id',
                loadChildren: 'src/app/pages/report-detail/report-detail.module#ReportDetailPageModule',
                canLoad: [UserAuthenticatedGuard]
            },
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
