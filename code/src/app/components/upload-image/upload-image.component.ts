import { Component, OnInit, Input } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

const opcionesCamara: CameraOptions = {
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

    imagenesSubidas = [];
    imagenB64: string;

    @Input() maxImages = 5;

    constructor(
        private camera: Camera
    ) { }

    ngOnInit() {
        opcionesCamara.destinationType = this.camera.DestinationType.DATA_URL;
        opcionesCamara.encodingType = this.camera.EncodingType.JPEG;
        opcionesCamara.mediaType = this.camera.MediaType.PICTURE;
    }

    loadImageFromGallery() {
        opcionesCamara.sourceType = this.camera.PictureSourceType.PHOTOLIBRARY;
        console.log({ gallery: opcionesCamara });
        if (this.imagenesSubidas.length < this.maxImages) {
            this.uploadImage();
        }
    }

    loadImageFromCamera() {
        opcionesCamara.sourceType = this.camera.PictureSourceType.CAMERA;
        console.log({ cm: opcionesCamara });
        if (this.imagenesSubidas.length < this.maxImages) {
            this.uploadImage();
        }
    }

    uploadImage() {
        this.camera.getPicture(opcionesCamara)
            .then(
                (datosImagen) => {
                    // DatoImagen es un string codificado en base64 - BASE URI
                    this.imagenB64 = `data:image/jpeg;base64,${datosImagen}`;
                    // console.log({ datosImagenCamara: datosImagen });
                    this.imagenesSubidas.push(this.imagenB64);
                }, err => {
                    console.log({ errorCapturarImagen: err });
                    alert(JSON.stringify(err));
                });
    }
}
