import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'backgroundUrl'
})
export class BackgroundUrlPipe implements PipeTransform {

    constructor( private domSanitizer: DomSanitizer ) { }

  transform(img: string): any {
      const bgStyle = `
        background-image: url('${img}');
      `;

    return this.domSanitizer.bypassSecurityTrustStyle( bgStyle );
  }

}
