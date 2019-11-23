import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { UserAuthenticatedGuard } from './guards/user-authenticated.guard';
import { UserHasRoleGuard } from "./guards/user-has-role.guard";

const routes: Routes = [
    {
        path: '',
        redirectTo: '/home-list',
        pathMatch: 'full'
    },
    {
        path: 'about',
        loadChildren: './pages/about/about.module#AboutPageModule'
    },
    {
        path: 'directory',
        loadChildren: './pages/directory/directory-list/directory-list.module#DirectoryListPageModule'
    },
    {
        path: 'emergencies',
        loadChildren: './pages/emergencies/emergencies.module#EmergenciesPageModule'
    },
    {
        path: 'events',
        loadChildren: './pages/events/events.module#EventsPageModule'
    },
    {
        path: 'frequent-questions',
        loadChildren: './pages/frequent-questions/frequent-questions.module#FrequentQuestionsPageModule'
    },
    {
        path: 'home-list',
        loadChildren: './pages/home-list/home-list.module#HomeListPageModule',
        canLoad: [UserAuthenticatedGuard]
    },
    {
        path: 'home-screen',
        loadChildren: './pages/home-screen/home-screen.module#HomeScreenPageModule'
    },
    {
        path: 'login',
        loadChildren: './pages/login/login.module#LoginPageModule'
    },
    {
        path: 'public-services',
        loadChildren: './pages/public-services/public-services-app.module#PublicServicesAppPageModule',
    }, 
    {
        path: 'register',
        loadChildren: './pages/register/register.module#RegisterPageModule'
    },
    {
        path: 'reports',
        loadChildren: './pages/reports/reports.module#ReportsPageModule'
    },
    {
        path: 'social-problems',
        loadChildren: './pages/social-problems/social-problems.module#SocialProblemsPageModule'
    },
    {
        path: 'user-profile',
        loadChildren: './pages/user/user.module#UserPageModule',
        canLoad: [UserAuthenticatedGuard]
    },
    {
        path: '404',
        loadChildren: './pages/not-found/not-found.module#NotFoundPageModule'
    },
    {
        path: '**',
        redirectTo: '/404'
    }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule { }
