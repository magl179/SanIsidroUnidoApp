import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { EmergencyDetailPage } from './emergency-detail.page';
import { SmComponentsModule } from "../../../components/sm-components.module";
import { PipesModule } from "../../../pipes/pipes.module";
import { ImageDetailPageModule } from "../../../modals/image_detail/image_detail.module";
import { ImageDetailPage } from "../../../modals/image_detail/image_detail.page";

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
        ImageDetailPageModule
    ],
    declarations: [EmergencyDetailPage]
})
export class EmergencyDetailPageModule { }
