import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { UserProfilePage } from './user-profile.page';
import { SmComponentsModule } from 'src/app/components/sm-components.module';

import { EditProfilePage } from '../../../modals/edit-profile/edit-profile.page';
import { EditProfilePageModule } from '../../../modals/edit-profile/edit-profile.module';
import { ChangePasswordPage } from '../../../modals/change-password/change-password.page';
import { ChangePasswordPageModule } from '../../../modals/change-password/change-password.module';
import { RequestMembershipPage } from 'src/app/modals/request-membership/request-membership.page';
import { RequestMembershipPageModule } from '../../../modals/request-membership/request-membership.module';

const routes: Routes = [
    {
        path: '',
        component: UserProfilePage
    }
];

@NgModule({
    entryComponents: [
        EditProfilePage,
        ChangePasswordPage,
        RequestMembershipPage
        // iMPORTAR PAGINA
    ],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild(routes),
        SmComponentsModule,
        EditProfilePageModule,
        ChangePasswordPageModule,
        RequestMembershipPageModule
    ],
    declarations: [UserProfilePage]
})
export class UserProfilePageModule { }
