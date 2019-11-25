import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ReportsPage } from './reports.page';
import { environment } from 'src/environments/environment';
import { CONFIG } from 'src/config/config';

const routes: Routes = [
    {
        path: '',
        component: ReportsPage,
        children: [
            {   path: 'list',
                loadChildren: "./reports-list/reports-list.module#ReportsListPageModule"
            },
            {
                path: 'search',
                loadChildren: "src/app/pages/shared/search-posts/search-posts.module#SearchPostsPageModule",
                data: {
                    searchIdeas: [],
                    searchPlaceholder: 'Buscar Informes',
                    searchRouteDetail: '/reports/list',
                    searchSlug: CONFIG.REPORTS_SLUG
                }
            },
            {
                path: 'list/:id',
                loadChildren: './report-detail/report-detail.module#ReportDetailPageModule'
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
    declarations: [ReportsPage]
})
export class ReportsPageModule { }
