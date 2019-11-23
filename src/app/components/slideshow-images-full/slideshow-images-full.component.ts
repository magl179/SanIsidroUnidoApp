import { Component, OnInit, Input } from "@angular/core";
import { UtilsService } from "src/app/services/utils.service";

@Component({
  selector: 'slideshow-images-full',
  templateUrl: './slideshow-images-full.component.html',
  styleUrls: ['./slideshow-images-full.component.scss'],
})
export class SlideshowImagesFullComponent implements OnInit {

    @Input() listImages: any[] = [];
    @Input() title = 'Imagen';
    @Input() ionSlideClass = '';
    @Input() ionSlidesClass = '';
    @Input() imgClass: string = '';
    @Input() slideAutoPlay = false;
    @Input() slideSpeed = 500;
    @Input() slidePager = false;

    constructor(
        private utilsService: UtilsService
    ) { }
    
    slideOpts:any = {};

    ngOnInit() {
        this.slideOpts.autoplay = this.slideAutoPlay;
        this.slideOpts.slideSpeed = this.slideSpeed;
    }
    
    seeImageDetail(url: string) {
        this.utilsService.seeImageDetail(url, this.title);
    }

}
