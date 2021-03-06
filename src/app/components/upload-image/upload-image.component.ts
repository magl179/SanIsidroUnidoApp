import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Platform } from '@ionic/angular';
import { MessagesService } from 'src/app/services/messages.service';
import { Observable, Observer, Subscription } from 'rxjs';
import { CONFIG } from 'src/config/config';
import { IUploadedImages, ICustomEvent, IProgressEvent } from 'src/app/interfaces/models';

let cameraOptions: CameraOptions = {
    quality: 90,
    correctOrientation: true,
    saveToPhotoAlbum: false,
    targetWidth: 600,
    targetHeight: 600,
};

@Component({
    selector: 'app-upload-image',
    templateUrl: './upload-image.component.html',
    styleUrls: ['./upload-image.component.scss'],
})
export class UploadImageComponent implements OnInit, OnDestroy {

    @Input() maxImages = 3;
    @Input() uploadedImages: string[] = [];
    @Input() quality: number = 85;
    @Output() returnUploadedImages = new EventEmitter<IUploadedImages>();
    private notifyToUnsubscribe: Subscription; 

    constructor(
        private camera: Camera,
        private messageService: MessagesService,
        private platform: Platform
    ) { }

    ngOnInit(): void {
        cameraOptions.destinationType = (CONFIG.USE_FILE_URL) ? this.camera.DestinationType.FILE_URI: this.camera.DestinationType.DATA_URL;
        cameraOptions.encodingType = this.camera.EncodingType.JPEG;
        cameraOptions.mediaType = this.camera.MediaType.PICTURE;
        cameraOptions.quality = this.quality;
        this.uploadedImages = [... this.uploadedImages];
    }

    ngOnDestroy(){
        console.log('on destroy image uplodad')
        if(this.notifyToUnsubscribe){
            this.notifyToUnsubscribe.unsubscribe();
        }
    }

    async getUploadedImages(): Promise<void> {
        this.returnUploadedImages.emit({
            uploaded_images: [...this.uploadedImages]
        });
    }

    loadImageFromGallery():void {
        cameraOptions.sourceType = this.camera.PictureSourceType.PHOTOLIBRARY;
        if (this.uploadedImages.length < this.maxImages) {
            this.uploadImage();
        } else {
            this.messageService.showInfo('Ya no puedes subir más imágenes');
        }
    }

    loadImageFromCamera():void {
        cameraOptions.sourceType = this.camera.PictureSourceType.CAMERA;
        if (this.uploadedImages.length < this.maxImages) {
            this.uploadImage();
        } else {
            this.messageService.showInfo('Ya no puedes subir más imágenes');
        }
    }

    dataURItoBlob(b64Data, contentType = 'image.jpg', sliceSize = 512): Blob {
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

        var blob = new Blob(byteArrays, { type: contentType });
        return blob;
    }

    deleteImage(index: number): void {
        this.uploadedImages.splice(index, 1);
    }

    async uploadImage(): Promise<void> {
        if (this.platform.is('cordova')) {
            if (CONFIG.USE_FILE_URL) {
                await this.camera.getPicture(cameraOptions)
                    .then(
                        (imgFileUri) => {
                            const imgURL = (<any>window).Ionic.WebView.convertFileSrc(imgFileUri);
                            this.messageService.showInfo('Procesando imagen, por favor espere')
                            this.notifyToUnsubscribe = this.getBase64ImageFromURL(imgURL).subscribe(base64data => {
                                const imagenB64 = 'data:image/jpg;base64,' + base64data;
                                this.uploadedImages.push(imagenB64);
                                this.getUploadedImages()
                                this.camera.cleanup();
                            }, () => {
                                this.messageService.showError('Ocurrio un error al capturar la imagen');
                            });
                        }, () => {
                            this.messageService.showError('Ocurrio un error al capturar la imagen');
                        });
            } else {

                await this.camera.getPicture(cameraOptions)
                    .then(
                        (datosImagen) => {
                            const imagenB64 = 'data:image/jpg;base64,' + datosImagen;
                            this.uploadedImages.push(imagenB64);
                            this.getUploadedImages();
                        }, err => {
                            this.messageService.showError('Ocurrio un error al capturar la imagen');
                        });
            }

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
        input.addEventListener("change", async (event_upload: ICustomEvent) => {
            if (event_upload.target.files && event_upload.target.files.length > 0) {
                // Referencia a los archivos y convertirlos a un array
                const eventFiles = event_upload.target.files;
                let files_selected = Array.prototype.slice.call(eventFiles);
                //Recorrer archivos y leerlos
                await Promise.all(files_selected.map(async file => {
                    return new Promise((resolve) => {
                        var reader = new FileReader();
                        reader.onload = (readerEvent: IProgressEvent) => {
                            const content: string = readerEvent.target.result;
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


    getBase64ImageFromURL(url: string) {
        return Observable.create((observer: Observer<string>) => {
            let img = new Image();
            img.crossOrigin = 'Anonymous';
            img.src = url;
            if (!img.complete) {
                img.onload = () => {
                    observer.next(this.getBase64Image(img));
                    observer.complete();
                };
                img.onerror = (err) => {
                    observer.error(err);
                };
            } else {
                observer.next(this.getBase64Image(img));
                observer.complete();
            }
        });
    }

    getBase64Image(img: HTMLImageElement) {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        var dataURL = canvas.toDataURL("image/png");
        return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
    }
}
