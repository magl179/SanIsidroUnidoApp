import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { EmergencyDetailPage } from './emergency-detail.page';
import { SmComponentsModule } from "src/app/components/sm-components.module";
import { PipesModule } from "src/app/pipes/pipes.module";
import { ImageDetailPageModule } from "src/app/modals/image_detail/image_detail.module";
import { ImageDetailPage } from "src/app/modals/image_detail/image_detail.page";
import { NgFallimgModule } from 'ng-fallimg';

const routes: Routes = [
    {
        path: '',
        component: EmergencyDetailPage
    }
];

@NgModule({
    entryComponents: [
        ImageDetailPage
    ],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild(routes),
        SmComponentsModule,
        PipesModule,
        ImageDetailPageModule,
        NgFallimgModule
    ],
    declarations: [EmergencyDetailPage]
})
export class EmergencyDetailPageModule { }
