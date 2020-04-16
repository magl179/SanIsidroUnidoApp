import { FormAttendEmergencyModal } from './form-attend-emergency.page';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ReactiveFormsModule
    ],
    declarations: [FormAttendEmergencyModal]
})
export class FormAttendEmergencyModalModule { }