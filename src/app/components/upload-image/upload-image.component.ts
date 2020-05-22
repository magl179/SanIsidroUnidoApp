import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Platform } from '@ionic/angular';
import { MessagesService } from 'src/app/services/messages.service';

let cameraOptions: CameraOptions = {
    quality: 90,
    correctOrientation: true,
    saveToPhotoAlbum: false,
    allowEdit: false,
    // targetWidth: 300,
    // targetHeight: 300
};

@Component({
    selector: 'app-upload-image',
    templateUrl: './upload-image.component.html',
    styleUrls: ['./upload-image.component.scss'],
})
export class UploadImageComponent implements OnInit {

    @Input() maxImages = 3;
    @Input() uploadedImages = [];
    @Output() returnUploadedImages = new EventEmitter();
    imagenB64: string;
    imagejpg: string;

    constructor(
        private camera: Camera,
        private messageService: MessagesService,
        private platform: Platform
    ) { }

    ngOnInit() {
        cameraOptions.destinationType = this.camera.DestinationType.DATA_URL;
        cameraOptions.encodingType = this.camera.EncodingType.JPEG;
        cameraOptions.mediaType = this.camera.MediaType.PICTURE;
        this.uploadedImages = [... this.uploadedImages];
    }

    async getUploadedImages() {
        this.returnUploadedImages.emit({
            total_img: [...this.uploadedImages]
        });
    }

    loadImageFromGallery() {
        cameraOptions.sourceType = this.camera.PictureSourceType.PHOTOLIBRARY;
        if (this.uploadedImages.length < this.maxImages) {
            this.uploadImage();
        } else {
            this.messageService.showInfo('Ya no puedes subir más imágenes');
        }
    }

    getUploadImagePercent() {
        return (this.uploadedImages.length * 1) / (this.maxImages);
    }

    loadImageFromCamera() {
        cameraOptions.sourceType = this.camera.PictureSourceType.CAMERA;
        if (this.uploadedImages.length < this.maxImages) {
            this.uploadImage();
        } else {
            this.messageService.showInfo('Ya no puedes subir más imágenes');
        }
    }

    dataURItoBlob(b64Data, contentType = 'image.jpg', sliceSize = 512) {
        contentType = contentType || '';      
        var byteCharacters = atob(b64Data);
        var byteArrays = [];
      
        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
          var slice = byteCharacters.slice(offset, offset + sliceSize);
      
          var byteNumbers = new Array(slice.length);
          for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
          }
      
          var byteArray = new Uint8Array(byteNumbers);
      
          byteArrays.push(byteArray);
        }
      
        var blob = new Blob(byteArrays, {type: contentType});
        return blob;
      }

    deleteImage(pos: any) {
        this.uploadedImages.splice(pos, 1);
    }

    async uploadImage() {
        if (this.platform.is('cordova')) {
            await this.camera.getPicture(cameraOptions)
                .then(
                    (datosImagen) => {
                        const imagenB64 = 'data:image/jpg;base64,'+ datosImagen;
                        this.uploadedImages.push(imagenB64);
                        this.getUploadedImages();
                    }, err => {
                        this.messageService.showError('Ocurrio un error al capturar la imagen');
                    });
        } else {
            this.uploadImageWeb();
        }

    }


    uploadImageWeb() {
        let input = document.createElement('input');
        input.type = 'file';
        input.value = '';
        input.accept = "image/png,image/jpg,image/jpeg";
        input.multiple = true;
        input.addEventListener("change", async (event_upload: any) => {
            if (event_upload.target.files && event_upload.target.files.length > 0) {
                // Referencia a los archivos y convertirlos a un array
                const eventFiles = event_upload.target.files;
                let files_selected = Array.prototype.slice.call(eventFiles);
                //Recorrer archivos y leerlos
                await Promise.all(files_selected.map(async file => {
                    return new Promise((resolve, reject) => {
                        var reader = new FileReader();
                        reader.onload = (readerEvent: any) => {
                            const content = readerEvent.target.result;
                            if (this.uploadedImages.length < this.maxImages) {
                                this.uploadedImages.push(content);
                            }
                            resolve();
                        }
                        reader.readAsDataURL(file);
                    });
                }));
                if (event_upload.target) {
                    event_upload.target.value = "";
                }
                this.getUploadedImages();
            }
        });
        input.click();
    }
}
