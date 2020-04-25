import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { SocialProblemsPage } from './social-problems.page';
import { UserAuthenticatedGuard } from 'src/app/guards/user-authenticated.guard';
import { UserHasRoleGuard } from 'src/app/guards/user-has-role.guard';
import { CONFIG } from 'src/config/config';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { NgFallimgModule } from 'ng-fallimg';

const routes: Routes = [
    {
        path: '',
        component: SocialProblemsPage,
        children: [
            {
                path: 'categories',
                loadChildren: "./social-problems-categories/social-problems-categories.module#SocialProblemsCategoriesPageModule",
                canLoad: [UserAuthenticatedGuard]
            },
            {
                path: 'create',
                loadChildren: "./social-problem-create/social-problem-create.module#SocialProblemCreatePageModule",
                canLoad: [UserAuthenticatedGuard, UserHasRoleGuard],
                data: { roles: ['morador_afiliado'] }
            },
            {
                path: 'search',
                loadChildren: "src/app/pages/shared/search-posts/search-posts.module#SearchPostsPageModule",
                data: {
                    searchIdeas: [],
                    searchPlaceholder: 'Busca Problemas Sociales por su título',
                    searchRouteDetail: '/social-problems/list',
                    searchSlug: CONFIG.SOCIAL_PROBLEMS_SLUG,
                    redirectWith: 'subcategory+id'
                },
                canLoad: [UserAuthenticatedGuard]

            },
            {
                path: 'list/:subcategory',
                loadChildren: './social-problems-list/social-problems-list.module#SocialProblemsListPageModule', canLoad: [UserAuthenticatedGuard]
            },
            {
                path: 'list/:subcategory/:id',
                loadChildren: './social-problem-detail/social-problem-detail.module#SocialProblemDetailPageModule',
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
        RouterModule.forChild(routes),
        DirectivesModule,
        NgFallimgModule
    ],
    declarations: [SocialProblemsPage]
})
export class SocialProblemsPageModule { }
