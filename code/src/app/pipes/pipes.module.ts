import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FiltroSearchPipe } from './filtro-search.pipe';
import { BeafitulDatePipe } from './beafitul-date.pipe';
import { SimpleBeatifulDatePipe } from './simple-beatiful-date.pipe';

@NgModule({
    declarations: [
        FiltroSearchPipe,
        BeafitulDatePipe,
        SimpleBeatifulDatePipe
    ],
    imports: [
        CommonModule
    ],
    exports: [
        FiltroSearchPipe,
        BeafitulDatePipe,
        SimpleBeatifulDatePipe
  ]
})
export class PipesModule { }
