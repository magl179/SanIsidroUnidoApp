import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TruncatePipe } from './truncate.pipe';
import { ImageSanitizerPipe } from './image-sanitizer.pipe';
import { BackgroundUrlPipe } from './background-url.pipe';
import { ResourceSanitizerPipe } from './resource-sanitizer.pipe';
import { DateFnsPipe } from './datefns.pipe';

@NgModule({
    declarations: [
        TruncatePipe,
        ImageSanitizerPipe,
        BackgroundUrlPipe,
        ResourceSanitizerPipe,
        DateFnsPipe
    ],
    imports: [
        CommonModule
    ],
    exports: [
        TruncatePipe,
        ImageSanitizerPipe,
        BackgroundUrlPipe,
        ResourceSanitizerPipe,
        DateFnsPipe
    ]
})
export class PipesModule { }
