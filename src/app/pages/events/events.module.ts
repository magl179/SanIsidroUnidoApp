import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { EventsPage } from './events.page';
import { CONFIG } from 'src/config/config';

const routes: Routes = [
    {
        path: '',
        component: EventsPage,
        children: [
            {
                path: 'list',
                loadChildren: "./events-list/events-list.module#EventsListPageModule"
            },
            {
                path: 'detail/:id',
                loadChildren: './event-detail/event-detail.module#EventDetailPageModule'
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
    declarations: [EventsPage]
})
export class EventsPageModule { }
