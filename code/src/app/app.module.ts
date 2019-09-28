import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { SmComponentsModule } from './components/sm-components.module';

import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Facebook } from '@ionic-native/facebook/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Camera } from '@ionic-native/camera/ngx';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Device } from '@ionic-native/device/ngx';
import { Network } from '@ionic-native/network/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { IonicStorageModule } from '@ionic/storage';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { PopNotificationsComponent } from './components/pop-notifications/pop-notifications.component';
import { ShowListNotificationsPage } from './modals/show-list-notifications/show-list-notifications.page';
import { ShowListNotificationsPageModule } from './modals/show-list-notifications/show-list-notifications.module';
import { PipesModule } from './pipes/pipes.module';
import { DirectivesModule } from './directives/directives.module';
// Interceptores
import { AuthInterceptorService } from 'src/app/services/auth-interceptor.service';
// Imagenes por Defecto
import { NgFallimgModule } from 'ng-fallimg';
import { ImageDetailPage } from "./modals/image_detail/image_detail.page";
import { ImageDetailPageModule } from './modals/image_detail/image_detail.module';

@NgModule({
    declarations: [AppComponent],
    entryComponents: [PopNotificationsComponent, ShowListNotificationsPage, ImageDetailPage],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        IonicModule.forRoot(),
        AppRoutingModule,
        HttpClientModule,
        SmComponentsModule,
        ReactiveFormsModule,
        IonicStorageModule.forRoot(),
        NgFallimgModule.forRoot({
            default: 'https://via.placeholder.com/600?text=SanIsidroImage',
            user_avatar:  'assets/img/default/img_avatar.png',
            image_full: 'assets/img/default/image_full.png',
            cover_image: 'https://via.placeholder.com/600x200?text=SanIsidroImage'
        }),
        ShowListNotificationsPageModule,
        PipesModule,
        DirectivesModule,
        ImageDetailPageModule
    ],
    providers: [
        StatusBar,
        SplashScreen,
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        AndroidPermissions,
        Geolocation,
        Camera,
        LocationAccuracy,
        GooglePlus,
        Facebook,
        OneSignal,
        PhotoViewer,
        SocialSharing,
        Network,
        Device,
        InAppBrowser,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptorService,
            multi: true
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
