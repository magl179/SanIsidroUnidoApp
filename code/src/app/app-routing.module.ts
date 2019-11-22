import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { UserAuthenticatedGuard } from './guards/user-authenticated.guard';
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
        loadChildren: './pages/tutorial/tutorial.module#TutorialPageModule'
    },
    {
        path: 'public-services/:slug',
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
    {
        path: 'about',
        loadChildren: './pages/about/about.module#AboutPageModule'
    },
    {
        path: 'configuration',
        loadChildren: './pages/configuration/configuration.module#ConfigurationPageModule'
    },
    {
        path: 'frequent-questions',
        loadChildren: './pages/frequent-questions/frequent-questions.module#FrequentQuestionsPageModule'
    },
    {
        path: 'public-services-categories',
        loadChildren: './pages/public-services-categories/public-services-categories.module#PublicServicesCategoriesPageModule'
    },
    {
        path: 'public-service-detail/:id',
        loadChildren: './pages/public-service-detail/public-service-detail.module#PublicServiceDetailPageModule'
    },
    {
        path: 'emergencies-tabs',
        loadChildren: './pages/emergencies-tabs/emergencies-tabs.module#EmergenciesTabsPageModule'
    },
    {
        path: 'social-problems-tabs',
        loadChildren: './pages/social-problems-tabs/social-problems-tabs.module#SocialProblemsTabsPageModule'
    },
    {
        path: 'events-tabs',
        loadChildren: './pages/events-tabs/events-tabs.module#EventsTabsPageModule'
    },
    {
        path: 'reports-tabs',
        loadChildren: './pages/reports-tabs/reports-tabs.module#ReportsTabsPageModule'
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
