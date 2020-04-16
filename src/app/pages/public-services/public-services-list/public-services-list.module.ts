import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { PublicServicesListPage } from './public-services-list.page';
import { SmComponentsModule } from 'src/app/components/sm-components.module';

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
        RouterModule.forChild(routes),
        SmComponentsModule
    ]
})
export class PublicServicesListPageModule { }
