import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ShowListNotificationsPage } from './show-list-notifications.page';
import { SmComponentsModule } from 'src/app/components/sm-components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SmComponentsModule
  ],
  declarations: [ShowListNotificationsPage]
})
export class ShowListNotificationsPageModule {}
