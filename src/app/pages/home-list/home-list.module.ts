import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HomeListPage } from './home-list.page';
import { SmComponentsModule } from 'src/app/components/sm-components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { RequestMembershipPageModule } from 'src/app/modals/request-membership/request-membership.module';
import { RequestMembershipPage } from 'src/app/modals/request-membership/request-membership.page';


@NgModule({
  entryComponents: [
    RequestMembershipPage
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomeListPage
      }
    ]),
    DirectivesModule,
    SmComponentsModule,
    RequestMembershipPageModule
  ],
  declarations: [HomeListPage]
})
export class HomeListPageModule {}
