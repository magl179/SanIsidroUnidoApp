import { Component, OnInit, Input } from "@angular/core";
import { UtilsService } from "../../services/utils.service";

@Component({
  selector: 'slideshow-images-full',
  templateUrl: './slideshow-images-full.component.html',
  styleUrls: ['./slideshow-images-full.component.scss'],
})
export class SlideshowImagesFullComponent implements OnInit {

    @Input() listImages: any[] = [];
    @Input() title: string = 'Imagen';
    @Input() ionSlideClass: string = '';
    @Input() ionSlidesClass: string = '';
    @Input() imgClass: string = '';
    constructor(
        private utilsService: UtilsService
    ) { }
    
    slideOpts = {};

    ngOnInit() {
      console.log('listImages', this.listImages)
    }
    
    seeImageDetail(url: string) {
        this.utilsService.seeImageDetail(url, this.title);
    }

}
