import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { PublicServicesAppPage } from './public-services-app.page';
import { SmComponentsModule } from "src/app/components/sm-components.module";
import { PipesModule } from "src/app/pipes/pipes.module";

const routes: Routes = [
    {
        path: '',
        component: PublicServicesAppPage,
        children: [
            
        ]
    },
    {
        path: 'list/:category',
        loadChildren: './public-services-list/public-services-list.module#PublicServicesListPageModule'
    },
    {
        path: 'list/:category/:id',
        loadChildren: './public-service-detail/public-service-detail.module#PublicServiceDetailPageModule'
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild(routes),
        SmComponentsModule,
        PipesModule
    ],
    declarations: [PublicServicesAppPage]
})
export class PublicServicesAppPageModule { }
