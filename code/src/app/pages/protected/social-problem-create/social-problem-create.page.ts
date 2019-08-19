import { Component, OnInit } from '@angular/core';
import { UtilsService } from '../../../services/utils.service';
import { MapService } from 'src/app/services/map.service';
import { IPostUbicationItem } from 'src/app/interfaces/barrios';
import { LocalizationService } from '../../../services/localization.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { LocalDataService } from '../../../services/local-data.service';
import { PostsService } from '../../../services/posts.service';
import { environment } from 'src/environments/environment';
import { ISocialProblemReported, IUbication } from 'src/app/interfaces/models';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'app-social-problem-create',
    templateUrl: './social-problem-create.page.html',
    styleUrls: ['./social-problem-create.page.scss'],
})
export class SocialProblemCreatePage implements OnInit {

    currentStep = 3
    fullFormIsValid = false;

    socialProblemForm: FormGroup;
    errorMessages = null;
    // emergencyFormFields = {
    //     title: {
    //         required: true,
    //         minlength: 3,
    //         maxlength: 15
    //     },
    //     description: {
    //         required: true,
    //         minlength: 8,
    //         maxlength: 30
    //     }
    // };
    // activePane: PaneType = 'left';
    socialProblemFormStage = [
        { title: 'Paso 1' }, { title: 'Paso 2' },
        { title: 'Paso 3' }, { title: 'Paso 4' }
    ];
    socialProblemImages = [];
    socialProblemCoordinate: IUbication = {
        latitude: null,
        longitude: null,
        address: null
    };
    subcategories = [];
    // puntosUbicacion: SimpleUbicationItem;

    constructor(
        private utilsService: UtilsService,
        private mapService: MapService,
        public formBuilder: FormBuilder,
        private localizationService: LocalizationService,
        private localDataService: LocalDataService,
        private postService: PostsService
    ) {
        this.createForm();
    }

    async ngOnInit() {
        const coords = await this.localizationService.getCoordinate();
        this.socialProblemCoordinate.latitude = coords.latitude;
        this.socialProblemCoordinate.longitude = coords.longitude;
        this.postService.getSubcategoriesByCategory(environment.slugCategories.socialProblem).subscribe(res => {
            this.subcategories = res.data;
            console.log('subcategories', res.data);
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
        this.socialProblemForm = this.formBuilder.group({ title, description });
        this.localDataService.getFormMessagesValidations(validations); 
    }

    async sendSocialProblem() {
        const loadingReportSocialProblem = await this.utilsService.createBasicLoading('Enviando Reporte');
        
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

        loadingReportSocialProblem.present();
        const socialProblem: ISocialProblemReported = {
            title: this.socialProblemForm.value.title,
            description: this.socialProblemForm.value.description,
            ubication: this.socialProblemCoordinate
        };
        // await this.utilsService.showToast('Post Problema Social Valido', 2500);
        this.postService.sendSocialProblemReport(socialProblem).pipe(
            finalize(() => {
                loadingReportSocialProblem.dismiss()
            })
        ).subscribe(async res => {
            await this.utilsService.showToast("El Reporte fue enviado correctamente");
        }, err => {
            this.utilsService.showToast(err.error.message);
            console.log('Error Reportar Problema Social', err.error);
        });
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
