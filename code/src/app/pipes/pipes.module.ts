import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FiltroSearchPipe } from './filtro-search.pipe';

@NgModule({
    declarations: [
        FiltroSearchPipe
  ],
  imports: [
    CommonModule
    ],
    exports: [
        FiltroSearchPipe
  ]
})
export class PipesModule { }
