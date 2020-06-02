import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

@Pipe({
  name: 'backgroundUrl'
})
export class BackgroundUrlPipe implements PipeTransform {

    constructor( private domSanitizer: DomSanitizer ) { }

  transform(img: string): SafeStyle {
      const bgStyle = `
        background-image: url('${img}');
      `;

    return this.domSanitizer.bypassSecurityTrustStyle( bgStyle );
  }

}
