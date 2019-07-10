import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { UtilsService } from '../../../services/utils.service';
import { MapService } from 'src/app/services/map.service';
import { PostUbicationItem } from 'src/app/interfaces/barrios';
import { LocalizationService } from '../../../services/localization.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';


// type PaneType = 'left' | 'right';

@Component({
    selector: 'app-emergency-create',
    templateUrl: './emergency-create.page.html',
    styleUrls: ['./emergency-create.page.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmergencyCreatePage implements OnInit {

    currentStep = 1;
    emergencyPostValid = false;
    // activePane: PaneType = 'left';
    emergencyFormStage = [
        { title: 'Paso 1' }, { title: 'Paso 2' },
        { title: 'Paso 3' }, { title: 'Paso 4' }
    ];
    emergencyImages = [];
    emergencyPostCoordinate: PostUbicationItem = {
        latitude: null,
        longitude: null,
        address: null
    };
    emergencyForm: FormGroup;
    errorMessages = null;
    emergencyFormFields = {
        title: {
            required: true,
            minlength: 3,
            maxlength: 15
        },
        description: {
            required: true,
            minlength: 8,
            maxlength: 30
        }
    };
    // puntosUbicacion: SimpleUbicationItem;

    constructor(
        private utilsService: UtilsService,
        private mapService: MapService,
        public formBuilder: FormBuilder,
        private localizationService: LocalizationService
    ) {
        this.createForm();
        this.loadErrorMessages();
    }

    async ngOnInit() {
        const coords = await this.localizationService.getCoordinate();
        this.emergencyPostCoordinate.latitude = coords.latitud;
        this.emergencyPostCoordinate.longitude = coords.longitud;
        console.log(this.emergencyForm.get('title').value);
    }

    createForm() {
        const titleEmergency = new FormControl('', Validators.compose([
            Validators.required,
        ]));
        const descriptionEmergency = new FormControl('', Validators.compose([
            Validators.required,
        ]));
        this.emergencyForm = this.formBuilder.group({
            title: titleEmergency,
            description: descriptionEmergency
        });
    }

    loadErrorMessages() {
        this.errorMessages = {
            title: {
                required: {
                    message: 'El titulo es Obligatorio'
                },
                minlength: {
                    message: `El titulo debe contener minimo ${this.emergencyFormFields.title.minlength} caracteres`
                },
                maxlength: {
                    message: `El titulo debe contener máximo ${this.emergencyFormFields.title.maxlength} caracteres`
                }
            },
            description: {
                required: {
                    message: 'La descripción es Obligatoria'
                },
                minlength: {
                    message: `La descripción debe contener minimo ${this.emergencyFormFields.description.minlength} caracteres`
                },
                maxlength: {
                    message: `La descripción debe contener máximo ${this.emergencyFormFields.description.maxlength} caracteres`
                }
            }
        };

    }

    async getUploadedImages(event) {
        this.emergencyImages = event.total_img;
        await this.utilsService.showToast('update emergency images');

    }

    deleteImage(pos) {
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

    updateMapCoordinate(event) {
        console.log({ datosHijo: event });
        if (event.lat !== null && event.lng !== null) {
            this.emergencyPostCoordinate.latitude = event.lat;
            this.emergencyPostCoordinate.longitude = event.lng;
            this.getUserAddress(this.emergencyPostCoordinate.latitude, this.emergencyPostCoordinate.longitude);
        }

    }

    updateCurrentStep(event) {
        this.currentStep = event.currentStep;
    }

    getUserAddress(latitud, longitud) {
        this.mapService.getAddress({
            lat: latitud,
            lng: longitud,
            zoom: 14
        }).subscribe(direccion => {
            console.log({ add: direccion });
            this.emergencyPostCoordinate.address = direccion.display_name;
        },
            err => {
                console.log('Ocurrio un error al obtener la ubicación: ', err);
            });
    }

    async sendEmergencyReport() {
        if (this.emergencyForm.valid !== true) {
            await this.utilsService.showToast('Ingresa un titulo y una descripción', 2500);
            return;
        }

        if (this.emergencyPostCoordinate.address === null || this.emergencyPostCoordinate.address === null) {
            await this.utilsService.showToast('No se pudo obtener tu ubicación', 2500);
            return;
        }

        if (this.emergencyImages.length === 0) {
            await this.utilsService.showToast('Sube alguna imagen por favor', 2500);
            return;
        }

        await this.utilsService.showToast('Post Emergencia Valido', 2500);
    }



}
