import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { UserAuthenticatedGuard } from './guards/user-authenticated.guard';
// import { UserNotAuthenticatedGuard } from './guards/user-not-authenticated.guard';
import { UserHasRoleGuard } from "./guards/user-has-role.guard";
// import { UserIsActiveGuard } from "./guards/user-is-active.guard";

const routes: Routes = [
    
    {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        loadChildren: './pages/home/home.module#HomePageModule',
        canLoad: [UserAuthenticatedGuard]
    },
    {
        path: 'login',
        loadChildren: './pages/login/login.module#LoginPageModule'
    },
    {
        path: 'register',
        loadChildren: './pages/register/register.module#RegisterPageModule'
    },
    {
        path: 'tutorial',
        loadChildren: './pages/tutorial/tutorial.module#TutorialPageModule',
        // canLoad: [UserNotAuthenticatedGuard]
    },
    {
        path: 'social-problems',
        loadChildren: './pages/social-problems/social-problems.module#SocialProblemsPageModule', canLoad: [UserAuthenticatedGuard]
    },
    {
        path: 'public-services',
        loadChildren: './pages/public-services/public-services.module#PublicServicesPageModule',
        canLoad: [UserAuthenticatedGuard]
    },
    {
        path: 'directory-info',
        loadChildren: './pages/directory-info/directory-info.module#DirectoryInfoPageModule',
        canLoad: [UserAuthenticatedGuard,]
    },
    {
        path: 'user-profile',
        loadChildren: './pages/user-profile/user-profile.module#UserProfilePageModule',
        canLoad: [UserAuthenticatedGuard]
    },
    // tslint:disable-next-line: max-line-length
    {
        path: 'social-problem-detail/:id',
        loadChildren: './pages/social-problem-detail/social-problem-detail.module#SocialProblemDetailPageModule',
        canLoad: [UserAuthenticatedGuard]
    },
    {
        path: 'social-problem-create',
        loadChildren: './pages/social-problem-create/social-problem-create.module#SocialProblemCreatePageModule',
        canLoad: [UserAuthenticatedGuard, UserHasRoleGuard],
        data: { roles: ['morador_afiliado']}
    },
    {
        path: 'emergency-create',
        loadChildren: './pages/emergency-create/emergency-create.module#EmergencyCreatePageModule',
        canLoad: [UserAuthenticatedGuard, UserHasRoleGuard],
        data: {roles: ['morador_afiliado']}
    },
    {
        path: 'events',
        loadChildren: './pages/events/events.module#EventsPageModule',
        canLoad: [UserAuthenticatedGuard]
    },
    {
        path: 'event-detail/:id',
        loadChildren: './pages/event-detail/event-detail.module#EventDetailPageModule',
        canLoad: [UserAuthenticatedGuard]
    },
    {
        path: 'about',
        loadChildren: './pages/about/about.module#AboutPageModule',
        canLoad: [UserAuthenticatedGuard]
    },
    {
        path: 'configuration',
        loadChildren: './pages/configuration/configuration.module#ConfigurationPageModule'
    },
    {
        path: 'frequent-questions',
        loadChildren: './pages/frequent-questions/frequent-questions.module#FrequentQuestionsPageModule',
        canLoad: [UserAuthenticatedGuard]
    },
    {
        path: 'emergencies',
        loadChildren: './pages/emergencies/emergencies.module#EmergenciesPageModule',
        canLoad: [UserAuthenticatedGuard]
    },
    {
        path: 'emergency-detail/:id',
        loadChildren: './pages/emergency-detail/emergency-detail.module#EmergencyDetailPageModule'
    },
    {
        path: 'reports',
        loadChildren: './pages/reports/reports.module#ReportsPageModule',
        canLoad: [UserAuthenticatedGuard]
    },
    {
        path: 'report-detail/:id',
        loadChildren: './pages/report-detail/report-detail.module#ReportDetailPageModule',
        canLoad: [UserAuthenticatedGuard]
    },
    {
        path: '404',
        loadChildren: './pages/not-found/not-found.module#NotFoundPageModule'
    },
    {
        path: '**',
        redirectTo: '/404'
    },
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule { }
