import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DirectoryPage } from './directory.page';
import { Routes, RouterModule } from '@angular/router';
import { SmComponentsModule } from '../../components/sm-components.module';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgFallimgModule } from "ng-fallimg";

const routes: Routes = [
    {
        path: '',
        component: DirectoryPage
    }
];

@NgModule({
    declarations: [DirectoryPage],
    imports: [
        CommonModule,
        IonicModule,
        RouterModule.forChild(routes),
        FormsModule,
        ReactiveFormsModule,
        SmComponentsModule,
        NgFallimgModule
    ]
})
export class DirectoryPageModule { }
