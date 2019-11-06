import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { EmergencyCreatePage } from './emergency-create.page';
import { SmComponentsModule } from 'src/app/components/sm-components.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { MaterialAppModule } from 'src/app/material-app.module';

const routes: Routes = [
    {
        path: '',
        component: EmergencyCreatePage
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild(routes),
        SmComponentsModule,
        ReactiveFormsModule,
        PipesModule,
        MaterialAppModule
    ],
    declarations: [EmergencyCreatePage]
})
export class EmergencyCreatePageModule { }
