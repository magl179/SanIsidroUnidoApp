import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: './pages/home/home.module#HomePageModule' },
  { path: 'login', loadChildren: './pages/login/login.module#LoginPageModule' },
  { path: 'register', loadChildren: './pages/register/register.module#RegisterPageModule' },
  { path: 'social-problems', loadChildren: './pages/protected/social-problems/social-problems.module#SocialProblemsPageModule' },
  { path: 'public-services', loadChildren: './pages/protected/public-services/public-services.module#PublicServicesPageModule' },
  { path: 'directory-info', loadChildren: './pages/protected/directory-info/directory-info.module#DirectoryInfoPageModule' },
  { path: 'user-profile', loadChildren: './pages/protected/user-profile/user-profile.module#UserProfilePageModule' },
// tslint:disable-next-line: max-line-length
  { path: 'social-problem-detail/:id', loadChildren: './pages/protected/social-problem-detail/social-problem-detail.module#SocialProblemDetailPageModule' },
// tslint:disable-next-line: max-line-length
  { path: 'social-problem-create', loadChildren: './pages/protected/social-problem-create/social-problem-create.module#SocialProblemCreatePageModule' },
  { path: 'emergency-create', loadChildren: './pages/protected/emergency-create/emergency-create.module#EmergencyCreatePageModule' },
  { path: 'events', loadChildren: './pages/protected/events/events.module#EventsPageModule' },
  { path: 'event-detail/:id', loadChildren: './pages/protected/event-detail/event-detail.module#EventDetailPageModule' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
