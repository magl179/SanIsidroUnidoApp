import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { EventsTabsPage } from './events-tabs.page';

const routes: Routes = [
    {
        path: '',
        component: EventsTabsPage,
        children: [
            {
                path: 'list',
                loadChildren: "../events/events.module#EventsPageModule"
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
    declarations: [EventsTabsPage]
})
export class EventsTabsPageModule { }
