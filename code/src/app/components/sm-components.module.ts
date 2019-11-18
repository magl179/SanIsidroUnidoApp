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
import { PopNotificationsComponent } from './pop-notifications/pop-notifications.component';
import { ListNotificationsComponent } from './list-notifications/list-notifications.component';
import { StrengthPassbarComponent } from './strength-passbar/strength-passbar.component';
import { NetworkStateBarComponent } from './network-state-bar/network-state-bar.component';
import { NetworkBannerComponent } from './network-banner/network-banner.component';
import { GalleryImageComponent } from "./gallery-image/gallery-image.component";
import { SlideshowItemsComponent } from "./slideshow-items/slideshow-items.component";

import {MaterialAppModule} from 'src/app/material-app.module'
import { SelectOptionsComponent } from "./select-options/select-options.component";
import { LoadingAppComponent } from "./loading-app/loading-app.component";
import { NoResultsFoundComponent } from "./no-results-found/no-results-found.component";
import { SimpleRoutingMapComponent } from "./simple-routing-map/simple-routing-map.component";
import { SlideshowImagesFullComponent } from './slideshow-images-full/slideshow-images-full.component';
import { NgFallimgModule } from "ng-fallimg";

@NgModule({
    declarations: [
        HeaderComponent,
        HeaderBackComponent,
        SingleMapComponent,
        MultipleMapComponent,
        UploadImageComponent,
        StepBarComponent,
        SimpleMapComponent,
        SplashSmComponent,
        PopNotificationsComponent,
        ListNotificationsComponent,
        StrengthPassbarComponent,
        NetworkStateBarComponent,
        NetworkBannerComponent,
        GalleryImageComponent,
        SlideshowItemsComponent,
        SlideshowImagesFullComponent,
        SelectOptionsComponent,
        LoadingAppComponent,
        NoResultsFoundComponent,
        SimpleRoutingMapComponent,
    ],
    imports: [
        CommonModule,
        IonicModule,
        MaterialAppModule,
        NgFallimgModule
    ],
    exports: [
        HeaderComponent,
        HeaderBackComponent,
        SingleMapComponent,
        MultipleMapComponent,
        UploadImageComponent,
        StepBarComponent,
        SimpleMapComponent,
        SplashSmComponent,
        PopNotificationsComponent,
        ListNotificationsComponent,
        StrengthPassbarComponent,
        NetworkStateBarComponent,
        NetworkBannerComponent,
        GalleryImageComponent,
        SlideshowItemsComponent,
        SlideshowImagesFullComponent,
        SelectOptionsComponent,
        LoadingAppComponent,
        NoResultsFoundComponent,
        SimpleRoutingMapComponent
    ]
})
export class SmComponentsModule { }
