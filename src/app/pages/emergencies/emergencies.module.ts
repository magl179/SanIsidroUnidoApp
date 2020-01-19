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
import { DirectivesModule } from 'src/app/directives/directives.module';

const routes: Routes = [
    {
        path: '',
        component: EmergenciesPage,
        children: [
            {
                path: 'detail/:id',
                loadChildren: './emergency-detail/emergency-detail.module#EmergencyDetailPageModule',
                canLoad: [UserAuthenticatedGuard]
            },
            {
                path: 'create',
                loadChildren: './emergency-create/emergency-create.module#EmergencyCreatePageModule',
                canLoad: [UserAuthenticatedGuard, UserHasRoleGuard],
                data: { roles: ['morador_afiliado'] }
            },
            {
                path: 'list',
                loadChildren: "./emergencies-list/emergencies-list.module#EmergenciesListPageModule",
                canLoad: [UserAuthenticatedGuard]
            },
            // {
            //     path: 'report',
            //     loadChildren: "./emergency-create/emergency-create.module#EmergencyCreatePageModule",
            //     canLoad: [UserAuthenticatedGuard, UserHasRoleGuard],
            //     data: { roles: ['morador_afiliado'] }
            // },
            {
                path: 'search',
                loadChildren: "src/app/pages/shared/search-posts/search-posts.module#SearchPostsPageModule",
                data: {
                    searchIdeas: [],
                    searchPlaceholder: 'Buscar Mis Emergencias',
                    searchRouteDetail: '/emergencies/detail',
                    searchSlug: CONFIG.EMERGENCIES_SLUG,
                    includeUserFilter: true
                },
                canLoad: [UserAuthenticatedGuard]
            }           
        ]
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild(routes),
        DirectivesModule
    ],
    declarations: [EmergenciesPage]
})
export class EmergenciesPageModule { }
