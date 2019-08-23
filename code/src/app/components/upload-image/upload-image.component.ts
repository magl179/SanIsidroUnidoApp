import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { UtilsService } from 'src/app/services/utils.service';
import { Platform } from '@ionic/angular';

const cameraOptions: CameraOptions = {
    quality: 100,
    correctOrientation: true,
    saveToPhotoAlbum: false
};

@Component({
    selector: 'app-upload-image',
    templateUrl: './upload-image.component.html',
    styleUrls: ['./upload-image.component.scss'],
})
export class UploadImageComponent implements OnInit {

    // uploadedImages = [];
    imagenB64: string;
    imagejpg: string;
    

    @Input() maxImages = 3;
    @Input() uploadedImages = [];
    @Output() returnUploadedImages = new EventEmitter();

    constructor(
        private camera: Camera,
        private utilsService: UtilsService,
        private platform: Platform
    ) { }

    ngOnInit() {
        cameraOptions.destinationType = this.camera.DestinationType.DATA_URL;
        cameraOptions.encodingType = this.camera.EncodingType.JPEG;
        cameraOptions.mediaType = this.camera.MediaType.PICTURE;
        // cameraOptions.destinationType = this.camera.DestinationType.FILE_URI;
        // cameraOptions.encodingType = this.camera.EncodingType.JPEG;
        // cameraOptions.mediaType = this.camera.MediaType.PICTURE;
    }

    async getUploadedImages() {
        await this.returnUploadedImages.emit({
            total_img: this.uploadedImages
        });
    }

    loadImageFromGallery() {
        cameraOptions.sourceType = this.camera.PictureSourceType.PHOTOLIBRARY;
        console.log({ gallery: cameraOptions });
        if (this.uploadedImages.length < this.maxImages) {
            this.uploadImage();
        } else {
            this.utilsService.showToast('Ya no puedes subir más imagenes', 1500);
        }
    }

    getUploadImagePercent() {
        return (this.uploadedImages.length * 1) / (this.maxImages);
    }

    loadImageFromCamera() {
        cameraOptions.sourceType = this.camera.PictureSourceType.CAMERA;
        console.log({ cm: cameraOptions });
        if (this.uploadedImages.length < this.maxImages) {
            this.uploadImage();
        } else {
            this.utilsService.showToast('Ya no puedes subir más imagenes', 1500);
        }
    }

    deleteImage(pos) {
        this.uploadedImages.splice(pos, 1);
    }

    async uploadImage() {
        if (this.platform.is('cordova')) {
            await this.camera.getPicture(cameraOptions)
                .then(
                    (datosImagen) => {
                        // DatoImagen es un string codificado en base64 - BASE URI
                        this.imagenB64 = `data:image/jpeg;base64,${datosImagen}`;
                        this.uploadedImages.push(this.imagenB64);
                        // this.uploadedImages.push(datosImagen);
                        // console.log('imagen subida', datosImagen);
                    }, err => {
                        console.log({ errorCapturarImagen: err });
                    });
            if (this.uploadedImages.length >= 1) {
                this.getUploadedImages();
                this.utilsService.showToast('Imagenes Enviadas al Padre', 1500);
            }
        } else {
            this.utilsService.showToast('Cordova no esta disponible', 1500);
        }

    }
}
