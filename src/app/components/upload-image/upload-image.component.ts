import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { UtilsService } from 'src/app/services/utils.service';
import { Platform } from '@ionic/angular';
import { MessagesService } from 'src/app/services/messages.service';

const cameraOptions: CameraOptions = {
    quality: 75,
    correctOrientation: true,
    saveToPhotoAlbum: false,
    targetWidth: 400,
    targetHeight: 200
};

@Component({
    selector: 'app-upload-image',
    templateUrl: './upload-image.component.html',
    styleUrls: ['./upload-image.component.scss'],
})
export class UploadImageComponent implements OnInit {

    @Input() maxImages = 3;
    @Input() uploadedImages = [];
    // uploadedImages = [];
    @Output() returnUploadedImages = new EventEmitter();
    imagenB64: string;
    imagejpg: string;
    // @ViewChild('web_upload_image') web_upload_image: ElementRef;


    constructor(
        private camera: Camera,
        private messageService: MessagesService,
        private utilsService: UtilsService,
        private platform: Platform,
    ) { }

    ngOnInit() {
        cameraOptions.destinationType = this.camera.DestinationType.DATA_URL;
        cameraOptions.encodingType = this.camera.EncodingType.JPEG;
        cameraOptions.mediaType = this.camera.MediaType.PICTURE;
        this.uploadedImages = [... this.uploadedImages];
    }

    async getUploadedImages() {
        // console.log('send upload images', this.uploadedImages)
        this.returnUploadedImages.emit({
            total_img: [...this.uploadedImages]
        });
    }

    loadImageFromGallery() {
        cameraOptions.sourceType = this.camera.PictureSourceType.PHOTOLIBRARY;
        if (this.uploadedImages.length < this.maxImages) {
            this.uploadImage('gallery');
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
            this.uploadImage('camera');
        } else {
            this.messageService.showInfo('Ya no puedes subir más imágenes');
        }
    }

    deleteImage(pos: any) {
        this.uploadedImages.splice(pos, 1);
    }

    async uploadImage(type = 'camera') {
        if (this.platform.is('cordova')) {
            await this.camera.getPicture(cameraOptions)
                .then(
                    (datosImagen) => {
                        // DatoImagen es un string codificado en base64 - BASE URI
                        this.imagenB64 = `data:image/jpeg;base64,${datosImagen}`;
                        this.uploadedImages.push(this.imagenB64);
                        this.getUploadedImages();
                    }, err => {
                        console.log({ errorCapturarImagen: err });
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
        // this.web_upload_image.addEventListener("change", async (event_upload: any) => {
        input.addEventListener("change", async (event_upload: any) => {
            if (event_upload.target.files && event_upload.target.files.length > 0) {
                // console.log('dentro del if event tartget');
                // Referencia a los archivos y convertirlos a un array
                const eventFiles = event_upload.target.files;
                let files_selected = Array.prototype.slice.call(eventFiles);
                //Recorrer archivos y leerlos
                await Promise.all(files_selected.map(async file => {
                    return new Promise((resolve, reject) => {
                        var reader = new FileReader();
                        reader.onload = (readerEvent: any) => {
                            var content = readerEvent.target.result;
                            if (this.uploadedImages.length < this.maxImages) {
                                this.uploadedImages.push(content);
                            }
                            resolve();
                        }
                        reader.readAsDataURL(file);
                    });
                }));
                // console.log('acabo leer imagenes promesa', event_upload);
                // console.log('acabo leer imagenes promesas', this.uploadedImages);
                if(event_upload.target){
                    event_upload.target.value = "";
                }
                this.getUploadedImages();
            }
        });
        input.click();
    }
}
