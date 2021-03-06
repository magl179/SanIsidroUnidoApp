import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PublicServiceDetailPage } from './public-service-detail.page';
import { PipesModule } from "src/app/pipes/pipes.module";
import { SmComponentsModule } from "src/app/components/sm-components.module";
import { PublicServiceDistancePipe } from '../pipes/public-service-distance.pipe';

const routes: Routes = [
    {
        path: '',
        component: PublicServiceDetailPage
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild(routes),
        PipesModule,
        SmComponentsModule
    ],
    declarations: [PublicServiceDetailPage, PublicServiceDistancePipe]
})
export class PublicServiceDetailPageModule { }
