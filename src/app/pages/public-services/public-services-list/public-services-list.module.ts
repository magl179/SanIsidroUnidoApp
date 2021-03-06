import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { PublicServicesListPage } from './public-services-list.page';
import { SmComponentsModule } from 'src/app/components/sm-components.module';
import { PipesModule } from 'src/app/pipes/pipes.module';

const routes: Routes = [
    {
        path: '',
        component: PublicServicesListPage
    }
];

@NgModule({
    declarations: [PublicServicesListPage],
    entryComponents: [],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ReactiveFormsModule,
        PipesModule,
        RouterModule.forChild(routes),
        SmComponentsModule
    ]
})
export class PublicServicesListPageModule { }
