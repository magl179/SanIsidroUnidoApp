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
import { FilterPostsComponent } from "./filter-posts/filter-posts.component";

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
        FilterPostsComponent
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
        SplashSmComponent,
        PopNotificationsComponent,
        ListNotificationsComponent,
        StrengthPassbarComponent,
        NetworkStateBarComponent,
        NetworkBannerComponent,
        FilterPostsComponent
    ]
})
export class SmComponentsModule { }
