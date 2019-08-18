import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FiltroSearchPipe } from './filtro-search.pipe';
import { BeafitulDatePipe } from './beafitul-date.pipe';
import { SimpleBeatifulDatePipe } from './simple-beatiful-date.pipe';
import { TruncatePipe } from './truncate.pipe';

@NgModule({
    declarations: [
        FiltroSearchPipe,
        BeafitulDatePipe,
        SimpleBeatifulDatePipe,
        TruncatePipe
    ],
    imports: [
        CommonModule
    ],
    exports: [
        FiltroSearchPipe,
        BeafitulDatePipe,
        SimpleBeatifulDatePipe,
        TruncatePipe
  ]
})
export class PipesModule { }
