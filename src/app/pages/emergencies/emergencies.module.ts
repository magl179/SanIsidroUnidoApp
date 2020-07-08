import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { EmergenciesPage } from './emergencies.page';
import { UserAuthenticatedGuard } from 'src/app/guards/user-authenticated.guard';
import { UserHasRoleGuard } from 'src/app/guards/user-has-role.guard';
import { CONFIG } from 'src/config/config';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { UserHasRoleMoradorGuard } from 'src/app/guards/user-has-role-morador.guard';

const routes: Routes = [
    {
        path: '',
        component: EmergenciesPage,
        children: [
            {
                path: 'list/:id',
                loadChildren: './emergency-detail/emergency-detail.module#EmergencyDetailPageModule',
                canActivate: [UserAuthenticatedGuard]
            },
            {
                path: 'create',
                loadChildren: './emergency-create/emergency-create.module#EmergencyCreatePageModule',
                canActivate: [UserAuthenticatedGuard]
            },
            {
                path: 'list',
                loadChildren: "./emergencies-list/emergencies-list.module#EmergenciesListPageModule",
                canActivate: [UserAuthenticatedGuard]
            },  
            {
                path: 'categories',
                loadChildren: "./emergencies-categories/emergencies-categories.module#EmergenciesCategoriesPageModule",
                canActivate: [UserAuthenticatedGuard]
            }     
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
    declarations: [EmergenciesPage]
})
export class EmergenciesPageModule { }
