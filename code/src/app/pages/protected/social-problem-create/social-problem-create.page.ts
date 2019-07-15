import { Component, OnInit } from '@angular/core';
import { UtilsService } from '../../../services/utils.service';
import { MapService } from 'src/app/services/map.service';
import { IPostUbicationItem } from 'src/app/interfaces/barrios';
import { LocalizationService } from '../../../services/localization.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

@Component({
    selector: 'app-social-problem-create',
    templateUrl: './social-problem-create.page.html',
    styleUrls: ['./social-problem-create.page.scss'],
})
export class SocialProblemCreatePage implements OnInit {


    currentStep = 1;
    fullFormIsValid = false;

    socialProblemForm: FormGroup;
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
    // activePane: PaneType = 'left';
    socialProblemFormStage = [
        { title: 'Paso 1' }, { title: 'Paso 2' },
        { title: 'Paso 3' }, { title: 'Paso 4' }
    ];
    socialProblemImages = [];
    socialProblemCoordinate: IPostUbicationItem = {
        latitude: null,
        longitude: null,
        address: null
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
        this.socialProblemCoordinate.latitude = coords.latitude;
        this.socialProblemCoordinate.longitude = coords.longitude;
    }

    createForm() {
        const titleEmergency = new FormControl('', Validators.compose([
            Validators.required,
        ]));
        const descriptionEmergency = new FormControl('', Validators.compose([
            Validators.required,
        ]));
        this.socialProblemForm = this.formBuilder.group({
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

    async sendSocialProblem() {
        if (this.socialProblemForm.valid !== true) {
            await this.utilsService.showToast('Ingresa un titulo y una descripción', 2500);
            return;
        }
        if (this.socialProblemCoordinate.address === null || this.socialProblemCoordinate.address === null) {
            await this.utilsService.showToast('No se pudo obtener tu ubicación', 2500);
            return;
        }
        if (this.socialProblemImages.length === 0) {
            await this.utilsService.showToast('Sube alguna imagen por favor', 2500);
            return;
        }

        await this.utilsService.showToast('Post Problema Social Valido', 2500);
    }

    deleteImage(pos) {
        this.socialProblemImages.splice(pos, 1);
    }

    previousStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
        }
    }
    nextStep() {
        const tamanioEtapas = Object.keys(this.socialProblemFormStage).length;
        if (this.currentStep < (tamanioEtapas)) {
            this.currentStep++;
        }
    }

    getUploadedImages(event) {
        this.socialProblemImages = event.total_img;
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
            this.socialProblemCoordinate.latitude = event.lat;
            this.socialProblemCoordinate.longitude = event.lng;
            this.getUserAddress(this.socialProblemCoordinate.latitude, this.socialProblemCoordinate.longitude);
        }

    }

    updateCurrentStep(event) {
        this.currentStep = event.currentStep;
    }

    async getUserAddress(latitud, longitud) {
        await this.mapService.getAddress({
            lat: latitud,
            lng: longitud,
            zoom: 14
        }).subscribe(direccion => {
            console.log({ add: direccion });
            this.socialProblemCoordinate.address = direccion.display_name;
        },
            err => {
                console.log('Ocurrio un error al obtener la ubicación: ', err);
            });
    }

}
