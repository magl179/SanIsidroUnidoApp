import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BeafitulDatePipe } from './beafitul-date.pipe';
import { TruncatePipe } from './truncate.pipe';
import { ImageSanitizerPipe } from './image-sanitizer.pipe';
import { BackgroundUrlPipe } from './background-url.pipe';
import { MomentPipe } from './moment.pipe';
import { ResourceSanitizerPipe } from './resource-sanitizer.pipe';

@NgModule({
    declarations: [
        BeafitulDatePipe,
        TruncatePipe,
        ImageSanitizerPipe,
        BackgroundUrlPipe,
        MomentPipe,
        ResourceSanitizerPipe
    ],
    imports: [
        CommonModule
    ],
    exports: [
        BeafitulDatePipe,
        TruncatePipe,
        ImageSanitizerPipe,
        BackgroundUrlPipe,
        MomentPipe,
        ResourceSanitizerPipe
    ]
})
export class PipesModule { }
