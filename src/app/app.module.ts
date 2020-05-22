import { NgModule  } from '@angular/core';
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
import { ImageDetailPage } from "./modals/image_detail/image_detail.page";
import { ImageDetailPageModule } from './modals/image_detail/image_detail.module';

import { File } from '@ionic-native/file/ngx';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { DocumentViewer } from '@ionic-native/document-viewer/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { ToastrModule } from 'ngx-toastr';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { AuthService } from './services/auth.service';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';

@NgModule({
    declarations: [AppComponent],
    entryComponents: [PopNotificationsComponent, ShowListNotificationsPage, ImageDetailPage],
    imports: [
        BrowserModule,
        ToastrModule.forRoot({
            positionClass: 'toast-bottom-right',
            preventDuplicates: true,
            timeOut: 2500,
        }),
        BrowserAnimationsModule,
        IonicModule.forRoot(),
        AppRoutingModule,
        HttpClientModule,
        SmComponentsModule,
        ReactiveFormsModule,
        IonicStorageModule.forRoot(),
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
        BackgroundMode,
        Geolocation,
        Camera,
        LocationAccuracy,
        GooglePlus,
        Facebook,
        File,
        FileOpener,
        FileTransfer,
        DocumentViewer,
        OneSignal,
        PhotoViewer,
        SocialSharing,
        Network,
        Device,
        WebView,
        InAppBrowser,
        Diagnostic,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptorService,
            multi: true
        },
        AuthService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
