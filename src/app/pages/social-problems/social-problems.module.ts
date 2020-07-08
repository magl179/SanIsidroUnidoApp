import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { SocialProblemsPage } from './social-problems.page';
import { UserAuthenticatedGuard } from 'src/app/guards/user-authenticated.guard';
import { UserHasRoleGuard } from 'src/app/guards/user-has-role.guard';
import { DirectivesModule } from 'src/app/directives/directives.module';

const routes: Routes = [
    {
        path: '',
        component: SocialProblemsPage,
        children: [
            {
                path: 'categories',
                loadChildren: "./social-problems-categories/social-problems-categories.module#SocialProblemsCategoriesPageModule",
                canActivate: [UserAuthenticatedGuard]
            },
            {
                path: 'create',
                loadChildren: "./social-problem-create/social-problem-create.module#SocialProblemCreatePageModule",
                canActivate: [UserAuthenticatedGuard, UserHasRoleGuard]
            },
            {
                path: 'list/:subcategory',
                loadChildren: './social-problems-list/social-problems-list.module#SocialProblemsListPageModule',
                canActivate: [UserAuthenticatedGuard]
            },
            {
                path: 'list/:subcategory/:id',
                loadChildren: './social-problem-detail/social-problem-detail.module#SocialProblemDetailPageModule',
                canActivate: [UserAuthenticatedGuard]
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
        DirectivesModule
    ],
    declarations: [SocialProblemsPage]
})
export class SocialProblemsPageModule { }
