import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoginAuthGuard } from './guards/login.guard';
import { NoLoginAuthGuard } from './guards/no-login.guard';

const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'home', loadChildren: './pages/home/home.module#HomePageModule' },
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
        loadChildren: './pages/protected/social-problems/social-problems.module#SocialProblemsPageModule', canActivate: [LoginAuthGuard]
    },
    {
        path: 'public-services',
        loadChildren: './pages/protected/public-services/public-services.module#PublicServicesPageModule',
        canActivate: [LoginAuthGuard]
    },
    {
        path: 'directory-info',
        loadChildren: './pages/protected/directory-info/directory-info.module#DirectoryInfoPageModule',
        canActivate: [LoginAuthGuard]
    },
    {
        path: 'user-profile',
        loadChildren: './pages/protected/user-profile/user-profile.module#UserProfilePageModule',
        canActivate: [LoginAuthGuard]
    },
    // tslint:disable-next-line: max-line-length
    {
        path: 'social-problem-detail/:id',
        loadChildren: './pages/protected/social-problem-detail/social-problem-detail.module#SocialProblemDetailPageModule',
        canActivate: [LoginAuthGuard]
    },
    // tslint:disable-next-line: max-line-length
    {
        path: 'social-problem-create',
        loadChildren: './pages/protected/social-problem-create/social-problem-create.module#SocialProblemCreatePageModule',
        canActivate: [LoginAuthGuard]
    },
    {
        path: 'emergency-create',
        loadChildren: './pages/protected/emergency-create/emergency-create.module#EmergencyCreatePageModule',
        canActivate: [LoginAuthGuard]
    },
    {
        path: 'events',
        loadChildren: './pages/protected/events/events.module#EventsPageModule',
        canActivate: [LoginAuthGuard]
    },
    {
        path: 'event-detail/:id',
        loadChildren: './pages/protected/event-detail/event-detail.module#EventDetailPageModule',
        canActivate: [LoginAuthGuard]
    },  { path: 'tutorial', loadChildren: './pages/tutorial/tutorial.module#TutorialPageModule' },
  { path: 'about', loadChildren: './pages/about/about.module#AboutPageModule' },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
