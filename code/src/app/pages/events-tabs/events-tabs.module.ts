import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { EventsTabsPage } from './events-tabs.page';
import { environment } from 'src/environments/environment';
import { UserAuthenticatedGuard } from 'src/app/guards/user-authenticated.guard';

const routes: Routes = [
    {
        path: '',
        component: EventsTabsPage,
        children: [
            {
                path: 'list',
                loadChildren: "src/app/pages/events/events.module#EventsPageModule"
            },
            {
                path: 'search',
                loadChildren: "src/app/pages/search-posts/search-posts.module#SearchPostsPageModule",
                data: {
                    searchIdeas: [],
                    searchPlaceholder: 'Buscar Eventos',
                    searchRouteDetail: '/events-tabs/detail',
                    searchSlug: environment.eventsSlug
                }

            },
            {
                path: 'detail/:id',
                loadChildren: 'src/app/pages/event-detail/event-detail.module#EventDetailPageModule',
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
    declarations: [EventsTabsPage]
})
export class EventsTabsPageModule { }
