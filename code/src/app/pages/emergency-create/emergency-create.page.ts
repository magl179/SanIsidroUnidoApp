import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { UtilsService } from 'src/app/services/utils.service';
import { MapService } from 'src/app/services/map.service';
import { LocalizationService } from 'src/app/services/localization.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { IEmergencyReported, IUbication } from 'src/app/interfaces/models';
import { PostsService } from 'src/app/services/posts.service';
import { LocalDataService } from 'src/app/services/local-data.service';
import { finalize } from 'rxjs/operators';
import { IRespuestaApiSIU } from "src/app/interfaces/models";
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { EventsService } from "src/app/services/events.service";

@Component({
    selector: 'app-emergency-create',
    templateUrl: './emergency-create.page.html',
    styleUrls: ['./emergency-create.page.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmergencyCreatePage implements OnInit {

    currentStep = 1;
    emergencyFormStage = [
        { title: 'Paso 1' }, { title: 'Paso 2' },
        { title: 'Paso 3' }, { title: 'Paso 4' }
    ];
    emergencyImages = [];
    emergencyPostCoordinate: IUbication = {
        latitude: null,
        longitude: null,
        address: null
    };
    emergencyForm: FormGroup;
    ubicationForm: FormGroup;
    errorMessages = null;

    constructor(
        private utilsService: UtilsService,
        private mapService: MapService,
        public formBuilder: FormBuilder,
        private router: Router,
        private localizationService: LocalizationService,
        private postService: PostsService,
        private events_app: EventsService,
        private localDataService: LocalDataService
    ) {
        this.createForm();
    }

    async ngOnInit() {
        const coords = await this.localizationService.getCoordinate();
        this.emergencyPostCoordinate.latitude = coords.latitude;
        this.emergencyPostCoordinate.longitude = coords.longitude;
    }

    createForm() {
        const validations = this.localDataService.getFormValidations();
        const title= new FormControl('', Validators.compose([
            Validators.required,
        ]));
        const description = new FormControl('', Validators.compose([
            Validators.required,
        ]));
        const description_ubication = new FormControl('', Validators.compose([
            Validators.required,
        ]));

        this.emergencyForm = this.formBuilder.group({ title, description });
        this.ubicationForm = this.formBuilder.group({description_ubication});
        this.errorMessages = this.localDataService.getFormMessagesValidations(validations);
    }

    async getUploadedImages(event) {
        this.emergencyImages = event.total_img;

    }

    deleteImage(pos: any) {
        this.emergencyImages.splice(pos, 1);
    }


    previosStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
        }
    }
    nextStep() {
        const tamanioEtapas = Object.keys(this.emergencyFormStage).length;
        if (this.currentStep < (tamanioEtapas)) {
            this.currentStep++;
        }
    }

    validatePhase1() {
        this.nextStep();
    }

    validatePhase2() {
        this.nextStep();
    }
    validatePhase3() {
        this.nextStep();
    }

    updateMapCoordinate(event: any) {
        console.log({ datosHijo: event });
        if (event.lat !== null && event.lng !== null) {
            this.emergencyPostCoordinate.latitude = event.latitude;
            this.emergencyPostCoordinate.longitude = event.longitude;
            this.getUserAddress(this.emergencyPostCoordinate.latitude, this.emergencyPostCoordinate.longitude);
        }
    }

    updateCurrentStep(event) {
        this.currentStep = event.currentStep;
    }

    getUserAddress(latitud: number, longitud: number) {
        this.mapService.getAddress({
            lat: latitud,
            lng: longitud,
            zoom: 14
        }).subscribe(direccion => {
            this.emergencyPostCoordinate.address = direccion.display_name;
        },(err: HttpErrorResponse) => {
            if (err.error instanceof Error) {
                console.log("Client-side error", err);
            } else {
                console.log("Server-side error", err);
            }
            this.utilsService.showToast({message: 'No se pudo obtener la dirección de tu ubicación'});
        });
    }

    async sendEmergencyReport() { 
        if (this.emergencyForm.valid !== true) {
            await this.utilsService.showToast({ message: 'Ingresa un titulo y una descripción'});
            return;
        }

        if (this.ubicationForm.valid !== true) {
            await this.utilsService.showToast({message: 'Ingresa una descripción de la ubicación'});
            return;
        }

        if (this.emergencyPostCoordinate.address === null || this.emergencyPostCoordinate.address === null) {
            await this.utilsService.showToast({message: 'No se pudo obtener tu ubicación'});
            return;
        }

        const loadingEmergencyReport = await this.utilsService.createBasicLoading('Enviando Reporte');

        const ubication = this.emergencyPostCoordinate;
        ubication.description = this.ubicationForm.value.description_ubication;

        loadingEmergencyReport.present();
        const socialProblem: IEmergencyReported = {
            title: this.emergencyForm.value.title,
            description: this.emergencyForm.value.description,
            ubication,
            images: this.emergencyImages
        };

        this.postService.sendEmergencyReport(socialProblem).pipe(
            finalize(() => {
                loadingEmergencyReport.dismiss()
            })
        ).subscribe(async (res: IRespuestaApiSIU) => {
            await this.utilsService.showToast({message: "El Reporte fue enviado correctamente"});
            this.events_app.resetEmergenciesEmitter();
            // this.router.navigate(['/emergencies'])
        }, (err: HttpErrorResponse) => {
            if (err.error instanceof Error) {
                console.log("Client-side error", err);
            } else {
                console.log("Server-side error", err);
            }
            this.utilsService.showToast({message: 'Ocurrio un error al enviar el reporte'});
        });
    }



}
