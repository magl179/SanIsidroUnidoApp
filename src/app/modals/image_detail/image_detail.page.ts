import { Component, OnInit, Input } from "@angular/core";
import { ModalController } from '@ionic/angular';
import { UtilsService } from "src/app/services/utils.service";

@Component({
    selector: 'modal-image-detail',
    templateUrl: './image_detail.page.html',
    styleUrls: ['./image_detail.page.scss'],
})
export class ImageDetailPage implements OnInit {

    @Input() image: string = "https://farm6.staticflickr.com/5591/15008867125_b61960af01_h.jpg";
    @Input() description = null;

    constructor(
        private modalCtrl: ModalController,
        private utilsService: UtilsService
    ) { }

    ngOnInit() {
    }

    shareImage() {
        const imgObject = {
            description: '', // message
            title: null, // subject
            image: this.image, // file image or [] images
            url: null // url to share
        };
        this.utilsService.shareSocial(imgObject);
    }

    closeModal() {
        this.modalCtrl.dismiss();
    }

}
