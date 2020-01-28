import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ReportsPage } from './reports.page';
import { CONFIG } from 'src/config/config';
import { UserAuthenticatedGuard } from 'src/app/guards/user-authenticated.guard';

const routes: Routes = [
    {
        path: '',
        component: ReportsPage,
        children: [
            {   path: 'list',
                loadChildren: "./reports-list/reports-list.module#ReportsListPageModule",
                canLoad: [UserAuthenticatedGuard]
            },
            {
                path: 'search',
                loadChildren: "src/app/pages/shared/search-posts/search-posts.module#SearchPostsPageModule",
                data: {
                    searchIdeas: [],
                    searchPlaceholder: 'Busca Informes por su tìtulo',
                    searchRouteDetail: '/reports/list',
                    searchSlug: CONFIG.REPORTS_SLUG
                },
                canLoad: [UserAuthenticatedGuard]
            },
            {
                path: 'list/:id',
                loadChildren: './report-detail/report-detail.module#ReportDetailPageModule',
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
    declarations: [ReportsPage]
})
export class ReportsPageModule { }
