import { NgModule } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatStepperModule } from '@angular/material/stepper';

@NgModule({
    exports: [
        MatButtonToggleModule,
        MatIconModule,
        MatSliderModule,
        MatGridListModule,
        MatStepperModule
    ]
})
export class MaterialAppModule { }
