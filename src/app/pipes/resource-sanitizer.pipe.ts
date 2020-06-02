import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Pipe({
  name: 'resourceSanitizer'
})
export class ResourceSanitizerPipe implements PipeTransform {

  constructor( private domSanitizer: DomSanitizer ) {}

  transform( img: string ): SafeResourceUrl {
    return  this.domSanitizer.bypassSecurityTrustResourceUrl( img ) ;
  }

}
