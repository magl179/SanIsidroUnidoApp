import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { UtilsService } from 'src/app/services/utils.service';
import { MapService } from 'src/app/services/map.service';
import { LocalizationService } from 'src/app/services/localization.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { IEmergencyReported, IUbication } from 'src/app/interfaces/models';
import { PostsService } from 'src/app/services/posts.service';
import { LocalDataService } from 'src/app/services/local-data.service';
import { finalize } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorService } from 'src/app/services/error.service';
import { MessagesService } from 'src/app/services/messages.service';
import { EventsService } from 'src/app/services/events.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-emergency-create',
    templateUrl: './emergency-create.page.html',
    styleUrls: ['./emergency-create.page.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmergencyCreatePage implements OnInit {

    emergencyImages = [];
    emergencyPostCoordinate: IUbication = {
        latitude: null,
        longitude: null,
        address: null
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

    async ngOnInit() {
        await this.localizationService.getCoordinates().then((coordinates: any) => {
            this.emergencyPostCoordinate.latitude = coordinates.latitude;
            this.emergencyPostCoordinate.longitude = coordinates.longitude;
        }).catch(() => {
            this.emergencyPostCoordinate.latitude = -0.096076;
            this.emergencyPostCoordinate.longitude =  -78.503606;
        });
    }

    createForm() {
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

    getUploadedImages(event: any) {
        this.emergencyImages = event.total_img;

    }

    deleteImage(pos: any) {
        this.emergencyImages.splice(pos, 1);
    }

    updateMapCoordinate(event: any) {
        if (event.lat !== null && event.lng !== null) {
            this.emergencyPostCoordinate.latitude = event.latitude;
            this.emergencyPostCoordinate.longitude = event.longitude;
            this.getUserAddress(this.emergencyPostCoordinate.latitude, this.emergencyPostCoordinate.longitude);
        }
    }

    getUserAddress(latitud: number, longitud: number) {
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

    async sendEmergencyReport() {

        if (this.emergencyForm.valid !== true) {
            return this.messageService.showInfo("Ingresa un titulo y una descripción");
        }
        if (this.ubicationForm.valid !== true) {
            return this.messageService.showInfo("Ingresa una descripción de tu ubicación");
        }
        if (this.emergencyPostCoordinate.address === null) {
            return this.messageService.showInfo("No se pudo obtener tu ubicación");
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
        ).subscribe(async (res: any) => {
            this.messageService.showSuccess("El Reporte fue enviado correctamente");
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
