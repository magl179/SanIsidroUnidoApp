import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import {HeaderBackComponent} from './header-back/header-back.component';
import {SingleMapComponent} from './single-map/single-map.component';
import {MultipleMapComponent} from './multiple-map/multiple-map.component';
// Para usar tags ionic
import { IonicModule } from '@ionic/angular';
import { UploadImageComponent } from './upload-image/upload-image.component';
import { StepBarComponent } from './step-bar/step-bar.component';
import { SimpleMapComponent } from './simple-map/simple-map.component';
import { SplashSmComponent } from './splash-sm/splash-sm.component';



@NgModule({
    declarations: [
        HeaderComponent,
        HeaderBackComponent,
        SingleMapComponent,
        MultipleMapComponent,
        UploadImageComponent,
        StepBarComponent,
        SimpleMapComponent,
        SplashSmComponent
    ],
    imports: [
        CommonModule,
        IonicModule
    ],
    exports: [
        HeaderComponent,
        HeaderBackComponent,
        SingleMapComponent,
        MultipleMapComponent,
        UploadImageComponent,
        StepBarComponent,
        SimpleMapComponent,
        SplashSmComponent
    ]
})
export class SmComponentsModule { }
