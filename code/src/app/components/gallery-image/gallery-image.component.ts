import { Component, OnInit, Input } from "@angular/core";
import { UtilsService } from "../../services/utils.service";

@Component({
    selector: 'gallery-image',
    templateUrl: './gallery-image.component.html',
    styleUrls: ['./gallery-image.component.scss'],
})
export class GalleryImageComponent implements OnInit {


    @Input() images: any[] = [];
    constructor(private utilsService: UtilsService) { }

    ngOnInit() { }

    seeImageFullScreen(image: string) {
        this.utilsService.seeImageDetail(image, 'Imagen Evento');

    }

}
