import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SocialProblemsTabsPage } from './social-problems-tabs.page';
import { environment } from 'src/environments/environment';
import { UserAuthenticatedGuard } from 'src/app/guards/user-authenticated.guard';
import { UserHasRoleGuard } from 'src/app/guards/user-has-role.guard';

const routes: Routes = [
    {
        path: '',
        component: SocialProblemsTabsPage,
        children: [
            {
                path: 'categories',
                loadChildren: "src/app/pages/social-problems-categories/social-problems-categories.module#SocialProblemsCategoriesPageModule"
            },
            {
                path: 'report',
                loadChildren: "src/app/pages/social-problem-create/social-problem-create.module#SocialProblemCreatePageModule"
            },
            {
                path: 'search',
                loadChildren: "src/app/pages/search-posts/search-posts.module#SearchPostsPageModule",
                data: {
                    searchIdeas: [],
                    searchPlaceholder: 'Buscar Problemas',
                    searchRouteDetail: '/social-problems-tabs/detail',
                    searchSlug: environment.socialProblemSlug,
                    redirectWith: 'subcategory+id'
                }

            },
            {
                path: 'create',
                loadChildren: 'src/app/pages/social-problem-create/social-problem-create.module#SocialProblemCreatePageModule',
                canLoad: [UserAuthenticatedGuard, UserHasRoleGuard],
                data: { roles: ['morador_afiliado'] }
            },
            {
                path: 'list/:slug_subcategory',
                loadChildren: 'src/app/pages/social-problems/social-problems.module#SocialProblemsPageModule', canLoad: [UserAuthenticatedGuard]
            },
            {
                path: 'detail/:slug_subcategory/:id',
                loadChildren: 'src/app/pages/social-problem-detail/social-problem-detail.module#SocialProblemDetailPageModule',
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
    declarations: [SocialProblemsTabsPage]
})
export class SocialProblemsTabsPageModule { }
