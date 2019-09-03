import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoginAuthGuard } from './guards/login.guard';
import { NoLoginAuthGuard } from './guards/no-login.guard';
import { HasRoleGuard } from './guards/has-role.guard';
import { IsActiveGuard } from "./guards/is-active.guard";

const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    {
        path: 'home',
        loadChildren: './pages/home/home.module#HomePageModule',
        canActivate: [LoginAuthGuard, IsActiveGuard]
    },
    {
        path: 'login',
        loadChildren: './pages/login/login.module#LoginPageModule',
        canActivate: [NoLoginAuthGuard]
    },
    {
        path: 'register',
        loadChildren: './pages/register/register.module#RegisterPageModule',
        canActivate: [NoLoginAuthGuard]
    },
    {
        path: 'social-problems',
        loadChildren: './pages/protected/social-problems/social-problems.module#SocialProblemsPageModule', canActivate: [LoginAuthGuard, IsActiveGuard]
    },
    {
        path: 'public-services',
        loadChildren: './pages/protected/public-services/public-services.module#PublicServicesPageModule',
        canActivate: [LoginAuthGuard, IsActiveGuard]
    },
    {
        path: 'directory-info',
        loadChildren: './pages/protected/directory-info/directory-info.module#DirectoryInfoPageModule',
        canActivate: [LoginAuthGuard, IsActiveGuard]
    },
    {
        path: 'user-profile',
        loadChildren: './pages/protected/user-profile/user-profile.module#UserProfilePageModule',
        canActivate: [LoginAuthGuard, IsActiveGuard]
    },
    // tslint:disable-next-line: max-line-length
    {
        path: 'social-problem-detail/:id',
        loadChildren: './pages/protected/social-problem-detail/social-problem-detail.module#SocialProblemDetailPageModule',
        canActivate: [LoginAuthGuard, IsActiveGuard]
    },
    // tslint:disable-next-line: max-line-length
    {
        path: 'social-problem-create',
        loadChildren: './pages/protected/social-problem-create/social-problem-create.module#SocialProblemCreatePageModule',
        canActivate: [LoginAuthGuard, IsActiveGuard, HasRoleGuard],
        data: { roles: ['morador_afiliado']}
    },
    {
        path: 'emergency-create',
        loadChildren: './pages/protected/emergency-create/emergency-create.module#EmergencyCreatePageModule',
        canActivate: [LoginAuthGuard, IsActiveGuard, HasRoleGuard],
        data: {roles: ['morador_afiliado']}
    },
    {
        path: 'events',
        loadChildren: './pages/protected/events/events.module#EventsPageModule',
        canActivate: [LoginAuthGuard, IsActiveGuard]
    },
    {
        path: 'event-detail/:id',
        loadChildren: './pages/protected/event-detail/event-detail.module#EventDetailPageModule',
        canActivate: [LoginAuthGuard, IsActiveGuard]
    },
    {
        path: 'tutorial',
        loadChildren: './pages/tutorial/tutorial.module#TutorialPageModule',
        canActivate: [LoginAuthGuard]
    },
    {
        path: 'about',
        loadChildren: './pages/about/about.module#AboutPageModule',
        canActivate: [LoginAuthGuard]
    },
    {
        path: 'configuration',
        loadChildren: './pages/protected/configuration/configuration.module#ConfigurationPageModule'
    },
    {
        path: 'frequent-questions',
        loadChildren: './pages/frequent-questions/frequent-questions.module#FrequentQuestionsPageModule',
        canActivate: [LoginAuthGuard]
    },


];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule { }
