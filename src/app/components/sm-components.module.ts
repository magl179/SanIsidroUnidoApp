import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import {HeaderBackComponent} from './header-back/header-back.component';
import {SingleMapComponent} from './single-map/single-map.component';
import { IonicModule } from '@ionic/angular';
import { UploadImageComponent } from './upload-image/upload-image.component';
import { SimpleMapComponent } from './simple-map/simple-map.component';
import { PopNotificationsComponent } from './pop-notifications/pop-notifications.component';
import { ListNotificationsComponent } from './list-notifications/list-notifications.component';

import {MaterialAppModule} from 'src/app/material-app.module';
import { LoadingAppComponent } from "./loading-app/loading-app.component";
import { NoResultsFoundComponent } from "./no-results-found/no-results-found.component";
import { SimpleRoutingMapComponent } from "./simple-routing-map/simple-routing-map.component";
import { SlideshowImagesFullComponent } from './slideshow-images-full/slideshow-images-full.component';
import { LocalizationInfoComponent } from './localization-info/localization-info.component';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
    declarations: [
        HeaderComponent,
        HeaderBackComponent,
        SingleMapComponent,
        UploadImageComponent,
        SimpleMapComponent,
        PopNotificationsComponent,
        ListNotificationsComponent,
        SlideshowImagesFullComponent,
        LoadingAppComponent,
        NoResultsFoundComponent,
        SimpleRoutingMapComponent,
        LocalizationInfoComponent
    ],
    imports: [
        CommonModule,
        IonicModule,
        MaterialAppModule,
        DirectivesModule,
        ReactiveFormsModule,
        PipesModule
    ],
    exports: [
        HeaderComponent,
        HeaderBackComponent,
        SingleMapComponent,
        UploadImageComponent,
        SimpleMapComponent,
        PopNotificationsComponent,
        ListNotificationsComponent,
        SlideshowImagesFullComponent,
        LoadingAppComponent,
        NoResultsFoundComponent,
        SimpleRoutingMapComponent,
        LocalizationInfoComponent
    ]
})
export class SmComponentsModule { }
