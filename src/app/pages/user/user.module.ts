import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { UserPage } from './user.page';
import { SmComponentsModule } from 'src/app/components/sm-components.module';
import { EditProfilePage } from 'src/app/modals/edit-profile/edit-profile.page';
import { EditProfilePageModule } from 'src/app/modals/edit-profile/edit-profile.module';
import { ChangePasswordPage } from 'src/app/modals/change-password/change-password.page';
import { ChangePasswordPageModule } from 'src/app/modals/change-password/change-password.module';
import { RequestMembershipPage } from 'src/app/modals/request-membership/request-membership.page';
import { RequestMembershipPageModule } from 'src/app/modals/request-membership/request-membership.module';
import { ChangeProfileImagePage } from 'src/app/modals/change-profile-image/change-profile-image.page';
import { ChangeProfileImagePageModule } from 'src/app/modals/change-profile-image/change-profile-image.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { PipesModule } from "src/app/pipes/pipes.module";

const routes: Routes = [
    {
        path: '',
        component: UserPage
    }
];

@NgModule({
    entryComponents: [
        EditProfilePage,
        ChangePasswordPage,
        ChangeProfileImagePage
    ],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild(routes),
        SmComponentsModule,
        EditProfilePageModule,
        ChangePasswordPageModule,
        ChangeProfileImagePageModule,
        DirectivesModule,
        PipesModule
    ],
    declarations: [UserPage]
})
export class UserPageModule { }
