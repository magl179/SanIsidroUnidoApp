import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Pipe({
  name: 'imageSanitizer'
})
export class ImageSanitizerPipe implements PipeTransform {

  constructor( private domSanitizer: DomSanitizer ) {}

  transform( img: string ): SafeUrl {
    return  this.domSanitizer.bypassSecurityTrustUrl( img ) ;
  }

}
