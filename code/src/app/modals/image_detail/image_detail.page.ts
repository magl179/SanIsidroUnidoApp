import { Component, OnInit, Input } from "@angular/core";
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'modal-image-detail',
  templateUrl: './image_detail.page.html',
  styleUrls: ['./image_detail.page.scss'],
})
export class ImageDetailPage implements OnInit {

    @Input() image: string = "https://farm6.staticflickr.com/5591/15008867125_b61960af01_h.jpg";
    // description2 = "Conoce a uno de neustros expositores @Splaktar visita nuestra cuenta Twitter @Angular Quito";
    @Input() description = null;

    constructor(
      private modalCtrl: ModalController
  ) { }

  ngOnInit() {
  }

  closeModal() {
    this.modalCtrl.dismiss();
}

}
