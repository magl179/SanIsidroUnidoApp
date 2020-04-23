import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FiltroSearchPipe } from './filtro-search.pipe';
import { BeafitulDatePipe } from './beafitul-date.pipe';
import { SimpleBeatifulDatePipe } from './simple-beatiful-date.pipe';
import { TruncatePipe } from './truncate.pipe';
import { JsonValidatePipe } from './json-validate.pipe';
import { ImageSanitizerPipe } from './image-sanitizer.pipe';
import { BackgroundUrlPipe } from './background-url.pipe';
import { MomentPipe } from './moment.pipe';

@NgModule({
    declarations: [
        FiltroSearchPipe,
        BeafitulDatePipe,
        SimpleBeatifulDatePipe,
        TruncatePipe,
        JsonValidatePipe,
        ImageSanitizerPipe,
        BackgroundUrlPipe,
        MomentPipe
    ],
    imports: [
        CommonModule
    ],
    exports: [
        FiltroSearchPipe,
        BeafitulDatePipe,
        SimpleBeatifulDatePipe,
        TruncatePipe,
        JsonValidatePipe,
        ImageSanitizerPipe,
        BackgroundUrlPipe,
        MomentPipe
    ]
})
export class PipesModule { }
