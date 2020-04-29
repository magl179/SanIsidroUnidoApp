import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ReportsPage } from './reports.page';

const routes: Routes = [
    {
        path: '',
        component: ReportsPage,
        children: [
            {   path: 'list',
                loadChildren: "./reports-list/reports-list.module#ReportsListPageModule",
            },
            {
                path: 'list/:id',
                loadChildren: './report-detail/report-detail.module#ReportDetailPageModule',
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
