import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { EventsPage } from './events.page';
import { environment } from 'src/environments/environment';
import { UserAuthenticatedGuard } from 'src/app/guards/user-authenticated.guard';
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
                path: 'search',
                loadChildren: "src/app/pages/shared/search-posts/search-posts.module#SearchPostsPageModule",
                data: {
                    searchIdeas: [],
                    searchPlaceholder: 'Busca Eventos por su título',
                    searchRouteDetail: '/events/detail',
                    searchSlug: CONFIG.EVENTS_SLUG
                },

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
