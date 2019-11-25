import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { EmergenciesPage } from './emergencies.page';
import { environment } from 'src/environments/environment';
import { UserAuthenticatedGuard } from 'src/app/guards/user-authenticated.guard';
import { UserHasRoleGuard } from 'src/app/guards/user-has-role.guard';
import { CONFIG } from 'src/config/config';

const routes: Routes = [
    {
        path: '',
        component: EmergenciesPage,
        children: [
            {
                path: 'detail/:id',
                loadChildren: './emergency-detail/emergency-detail.module#EmergencyDetailPageModule'
            },
            {
                path: 'create',
                loadChildren: './emergency-create/emergency-create.module#EmergencyCreatePageModule',
                canLoad: [UserAuthenticatedGuard, UserHasRoleGuard],
                data: { roles: ['morador_afiliado'] }
            },
            {
                path: 'list',
                loadChildren: "./emergencies-list/emergencies-list.module#EmergenciesListPageModule"
            },
            {
                path: 'report',
                loadChildren: "./emergency-create/emergency-create.module#EmergencyCreatePageModule"
            },
            {
                path: 'search',
                loadChildren: "src/app/pages/shared/search-posts/search-posts.module#SearchPostsPageModule",
                data: {
                    searchIdeas: [],
                    searchPlaceholder: 'Buscar Mis Emergencias',
                    searchRouteDetail: '/emergencies/detail',
                    searchSlug: CONFIG.EMERGENCIES_SLUG,
                    includeUserFilter: true
                }
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
    declarations: [EmergenciesPage]
})
export class EmergenciesPageModule { }
