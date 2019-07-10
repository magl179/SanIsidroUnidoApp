import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { SmComponentsModule } from './components/sm-components.module';

import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Camera } from '@ionic-native/camera/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { IonicStorageModule } from '@ionic/storage';
import { PopNotificationsComponent } from './components/pop-notifications/pop-notifications.component';
import { ShowListNotificationsPage } from './modals/show-list-notifications/show-list-notifications.page';
import { ShowListNotificationsPageModule } from './modals/show-list-notifications/show-list-notifications.module';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [PopNotificationsComponent, ShowListNotificationsPage],
  imports: [BrowserModule, BrowserAnimationsModule, IonicModule.forRoot(), AppRoutingModule,
    HttpClientModule, SmComponentsModule, ReactiveFormsModule, IonicStorageModule.forRoot(), ShowListNotificationsPageModule],
  providers: [
    StatusBar,
    SplashScreen,
      { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
      AndroidPermissions,
      Camera,
      Geolocation,
      LocationAccuracy
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
