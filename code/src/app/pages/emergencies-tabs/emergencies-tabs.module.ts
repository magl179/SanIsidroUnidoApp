import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { EmergenciesTabsPage } from './emergencies-tabs.page';

const routes: Routes = [
    {
        path: '',
        component: EmergenciesTabsPage,
        children: [
            {
                path: 'list',
                loadChildren: "../emergencies/emergencies.module#EmergenciesPageModule"
            },
            {
                path: 'report',
                loadChildren: "../emergency-create/emergency-create.module#EmergencyCreatePageModule"
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
    declarations: [EmergenciesTabsPage]
})
export class EmergenciesTabsPageModule { }
