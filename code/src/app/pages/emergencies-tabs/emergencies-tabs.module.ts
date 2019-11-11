import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { EmergenciesTabsPage } from './emergencies-tabs.page';
import { environment } from 'src/environments/environment';
import { UserAuthenticatedGuard } from 'src/app/guards/user-authenticated.guard';
import { UserHasRoleGuard } from 'src/app/guards/user-has-role.guard';

const routes: Routes = [
    {
        path: '',
        component: EmergenciesTabsPage,
        children: [
            {
                path: 'list',
                loadChildren: "src/app/pages/emergencies/emergencies.module#EmergenciesPageModule"
            },
            {
                path: 'report',
                loadChildren: "src/app/pages/emergency-create/emergency-create.module#EmergencyCreatePageModule"
            },
            {
                path: 'search',
                loadChildren: "src/app/pages/search-posts/search-posts.module#SearchPostsPageModule",
                data: {
                    searchIdeas: [],
                    searchPlaceholder: 'Buscar Mis Emergencias',
                    searchRouteDetail: '/emergencies-tabs/detail',
                    searchSlug: environment.emergenciesSlug,
                    includeUserFilter: true
                }
            },
            {
                path: 'detail/:id',
                loadChildren: 'src/app/pages/emergency-detail/emergency-detail.module#EmergencyDetailPageModule'
            },
            {
                path: 'create',
                loadChildren: 'src/app/pages/emergency-create/emergency-create.module#EmergencyCreatePageModule',
                canLoad: [UserAuthenticatedGuard, UserHasRoleGuard],
                data: { roles: ['morador_afiliado'] }
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
    declarations: [EmergenciesTabsPage]
})
export class EmergenciesTabsPageModule { }
