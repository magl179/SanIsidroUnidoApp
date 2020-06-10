import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { UtilsService } from 'src/app/services/utils.service';
import { MapService } from 'src/app/services/map.service';
import { LocalizationService } from 'src/app/services/localization.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { IEmergencyReported, IUbication, ISimpleCoordinates, IUploadedImages } from 'src/app/interfaces/models';
import { PostsService } from 'src/app/services/posts.service';
import { LocalDataService } from 'src/app/services/local-data.service';
import { finalize } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorService } from 'src/app/services/error.service';
import { MessagesService } from 'src/app/services/messages.service';
import { EventsService } from 'src/app/services/events.service';
import { Router } from '@angular/router';
import { UploadImageComponent } from 'src/app/components/upload-image/upload-image.component';
import { CONFIG } from 'src/config/config';

@Component({
    selector: 'app-emergency-create',
    templateUrl: './emergency-create.page.html',
    styleUrls: ['./emergency-create.page.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmergencyCreatePage implements OnInit {

    @ViewChild(UploadImageComponent) uploadImageComponent: UploadImageComponent;
    emergencyImages = [];
    emergencyPostCoordinate: IUbication = {
        latitude: CONFIG.DEFAULT_LOCATION.latitude,
        longitude: CONFIG.DEFAULT_LOCATION.longitude,
        address: CONFIG.DEFAULT_LOCATION.address
    };
    emergencyForm: FormGroup;
    ubicationForm: FormGroup;
    formSended = false;
    errorMessages = null;

    constructor(
        private utilsService: UtilsService,
        private cdRef: ChangeDetectorRef,
        private router: Router,
        private mapService: MapService,
        private messageService: MessagesService,
        private errorService: ErrorService,
        public formBuilder: FormBuilder,
        public events_app: EventsService,
        private localizationService: LocalizationService,
        private postService: PostsService,
        private localDataService: LocalDataService
    ) {
        this.createForm();
    }

    async ngOnInit(): Promise<void> {
        await this.localizationService.getCoordinates().then((coordinates: ISimpleCoordinates) => {
            this.emergencyPostCoordinate.latitude = coordinates.latitude;
            this.emergencyPostCoordinate.longitude = coordinates.longitude;
        }).catch(() => {
            this.emergencyPostCoordinate.latitude = -0.096076;
            this.emergencyPostCoordinate.longitude =  -78.503606;
        });
        this.getUserAddress(this.emergencyPostCoordinate.latitude, this.emergencyPostCoordinate.longitude);
    }

    createForm():void {
        const validations = this.localDataService.getFormValidations();
        const title = new FormControl('', Validators.compose([
            Validators.required,
        ]));
        const description = new FormControl('', Validators.compose([
            Validators.required,
        ]));
        const description_ubication = new FormControl('', Validators.compose([
            Validators.required,
        ]));

        this.emergencyForm = this.formBuilder.group({ title, description });
        this.ubicationForm = this.formBuilder.group({ description_ubication });
        this.errorMessages = this.localDataService.getFormMessagesValidations(validations);
    }

    getUploadedImages(event: IUploadedImages): void {
        this.emergencyImages = event.uploaded_images;        
    }

    deleteImage(index: number):void {
        this.emergencyImages.splice(index, 1);
        this.uploadImageComponent.deleteImage(index);
    }

    updateMapCoordinate(event: ISimpleCoordinates):void {
        if (event.latitude !== null && event.latitude !== null) {
            this.emergencyPostCoordinate.latitude = event.latitude;
            this.emergencyPostCoordinate.longitude = event.longitude;
            this.getUserAddress(this.emergencyPostCoordinate.latitude, this.emergencyPostCoordinate.longitude);
        }
    }

    preventEnterPressed($event: KeyboardEvent): void {
        $event.preventDefault()
        $event.stopPropagation()
    }

    getUserAddress(latitud: number, longitud: number): void {
        this.mapService.getAddress({
            lat: latitud,
            lng: longitud,
            zoom: 17
        }).subscribe(direccion => {
            this.emergencyPostCoordinate.address = direccion.display_name;
            //Ejecutar la deteccion de cambios de Angular de forma manual
            this.cdRef.detectChanges();
        }, (error_http: HttpErrorResponse) => {
            this.errorService.manageHttpError(error_http, 'Ocurrio un error al obtener la dirección de tu ubicación');
        });
    }

    seeImageDetail(url: string): void {
        this.utilsService.seeImageDetail(url, '');
    }

    async sendEmergencyReport(): Promise<null> {

        if (this.emergencyForm.valid !== true) {
            this.messageService.showInfo("Ingresa un titulo y una descripción");
            return null;
        }
        if (this.ubicationForm.valid !== true) {
            this.messageService.showInfo("Ingresa una descripción de tu ubicación");
            return null;
        }
        if (this.emergencyPostCoordinate.address === null) {
            this.messageService.showInfo("No se pudo obtener tu ubicación");
            return null;
        }

        if (this.emergencyImages.length == 0) {
            this.messageService.showInfo("Debes subir al menos una imagen acerca del reporte");
            return null;
        }

        const loadingEmergencyReport = await this.utilsService.createBasicLoading('Enviando Reporte');

        const ubication = this.emergencyPostCoordinate;
        ubication.description = this.ubicationForm.value.description_ubication;

        loadingEmergencyReport.present();

        const emergencyProblem: IEmergencyReported = {
            title: this.emergencyForm.value.title,
            description: this.emergencyForm.value.description,
            ubication,
            images: this.emergencyImages
        };

        this.postService.sendEmergencyReport(emergencyProblem).pipe(
            finalize(() => {
                loadingEmergencyReport.dismiss()
            })
        ).subscribe(() => {
            this.messageService.showSuccess("Reporte enviado correctamente, cuando sea aprobado lo podrás visualizar en el listado");
            this.formSended = true;
            this.events_app.resetEmergenciesEmitter();
            this.cdRef.detectChanges();
            setTimeout(() => {
                this.router.navigateByUrl(`/emergencies/list`);
            }, 1000);

        }, (error_http: HttpErrorResponse) => {
            this.errorService.manageHttpError(error_http, 'Ocurrio un error al enviar tu reporte');
        });
    }





}
