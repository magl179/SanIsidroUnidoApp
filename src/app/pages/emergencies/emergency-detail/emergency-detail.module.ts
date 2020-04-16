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
import { FormAttendEmergencyModalModule } from 'src/app/modals/form-attend-emergency/form-attend-emergency.module';
import { FormAttendEmergencyModal } from 'src/app/modals/form-attend-emergency/form-attend-emergency.page';

const routes: Routes = [
    {
        path: '',
        component: EmergencyDetailPage
    }
];

@NgModule({
    entryComponents: [
        ImageDetailPage,
        FormAttendEmergencyModal
    ],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild(routes),
        SmComponentsModule,
        PipesModule,
        ImageDetailPageModule,
        NgFallimgModule,
        FormAttendEmergencyModalModule
    ],
    declarations: [EmergencyDetailPage]
})
export class EmergencyDetailPageModule { }
