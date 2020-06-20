import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { UserAuthenticatedGuard } from './guards/user-authenticated.guard';
import { UserIsLoggedGuard } from './guards/user-is-logged.guard';

const routes: Routes = [
    {
        path: '',
        redirectTo: '/home-screen',
        pathMatch: 'full'
    },
    {
        path: 'about', //Pantalla de la Página que muestra información sobre la aplicación
        loadChildren: './pages/about/about.module#AboutPageModule'
    },
    {
        path: 'directory', //Pantalla de Pàgina de Directorio Barrial
        loadChildren: './pages/directory/directory.module#DirectoryPageModule',
    },
    {
        path: 'emergencies', //Pantalla de Pagina de Emergencias
        loadChildren: './pages/emergencies/emergencies.module#EmergenciesPageModule',
        canLoad: [UserAuthenticatedGuard]
    },
    {
        path: 'events', //Pantalla de Pagina de Eventos
        loadChildren: './pages/events/events.module#EventsPageModule',
        canLoad: [UserAuthenticatedGuard]
    },
    {
        path: 'frequent-questions', //Pantalla de Pagina de Preguntas Frecuentes
        loadChildren: './pages/frequent-questions/frequent-questions.module#FrequentQuestionsPageModule'
    },
    {
        path: 'home-list', //Pantalla Home Items Menu App
        loadChildren: './pages/home-list/home-list.module#HomeListPageModule',
    },
    {
        path: 'home-screen', //Pantalla Slider al Inicio App
        loadChildren: './pages/home-screen/home-screen.module#HomeScreenPageModule',
        canLoad: []
    },
    {
        path: 'login', //Pantalla de Login
        loadChildren: './pages/login/login.module#LoginPageModule'
    },
    {
        path: 'public-services', //Pantalla de Servicios Públicos
        loadChildren: './pages/public-services/public-services-app.module#PublicServicesAppPageModule',
       
    }, 
    {
        path: 'register', //Pantalla de Registro
        loadChildren: './pages/register/register.module#RegisterPageModule',
    },
    {
        path: 'reports', //Pantalla de Reportes
        loadChildren: './pages/reports/reports.module#ReportsPageModule',
        canLoad: [UserAuthenticatedGuard]
    },
    {
        path: 'social-problems', //Pantalla de Problemas Sociales
        loadChildren: './pages/social-problems/social-problems.module#SocialProblemsPageModule',
        canLoad: [UserAuthenticatedGuard]
    },
    {
        path: 'user-profile', //Pantalla del Perfil de Usuario
        loadChildren: './pages/user/user.module#UserPageModule',
        canLoad: [UserAuthenticatedGuard]
    },
    {
        path: '404', //Pantalla de Error
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
