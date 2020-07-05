import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { EventsPage } from './events.page';
import { UserAuthenticatedGuard } from 'src/app/guards/user-authenticated.guard';

const routes: Routes = [
    {
        path: '',
        component: EventsPage,
        children: [
            {
                path: 'categories',
                loadChildren: "./events-categories/events-categories.module#EventsCategoriesPageModule",
                canLoad: [UserAuthenticatedGuard]
            },
            {
                path: 'list/:subcategory',
                loadChildren: "./events-list/events-list.module#EventsListPageModule"
            },
            {
                path: 'list/:subcategory/:id',
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
