import { Component, OnInit } from '@angular/core';
import { UtilsService } from 'src/app/services/utils.service';
import { MapService } from 'src/app/services/map.service';
import { LocalizationService } from 'src/app/services/localization.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { LocalDataService } from 'src/app/services/local-data.service';
import { PostsService } from 'src/app/services/posts.service';
import { environment } from 'src/environments/environment';
import { ISocialProblemReported, IUbication } from 'src/app/interfaces/models';
import { finalize } from 'rxjs/operators';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { EventsService } from "src/app/services/events.service";

@Component({
    selector: 'app-social-problem-create',
    templateUrl: './social-problem-create.page.html',
    styleUrls: ['./social-problem-create.page.scss'],
})
export class SocialProblemCreatePage implements OnInit {

    currentStep = 1;
    socialProblemForm: FormGroup;
    ubicationForm: FormGroup;
    errorMessages = null; 
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

    constructor(
        private utilsService: UtilsService,
        private mapService: MapService,
        public formBuilder: FormBuilder,
        private router: Router,
        private localizationService: LocalizationService,
        private localDataService: LocalDataService,
        private events_app: EventsService,
        private postService: PostsService,
        private navCtrl: NavController
    ) {
        this.createForm();
    }

    async ngOnInit() {
        console.warn('NG ON INIT SOCIAL PROBLEMS');
        const coords = await this.localizationService.getCoordinate();
        this.socialProblemCoordinate.latitude = coords.latitude;
        this.socialProblemCoordinate.longitude = coords.longitude;
        this.postService.getSubcategoriesByCategory(environment.socialProblemSlug).subscribe(res => {
            this.subcategories = res.data;
            console.log('subcategories', res.data);
        }, (err: HttpErrorResponse) => {
            if (err.error instanceof Error) {
                console.log("Client-side error", err);
            } else {
                console.log("Server-side error", err);
            }
        });
    }

    createForm() {
        const validations = this.localDataService.getFormValidations();
        const title = new FormControl('', Validators.compose([
            Validators.required
        ]));
        const description = new FormControl('', Validators.compose([
            Validators.required
        ]));
        const description_ubication = new FormControl('', Validators.compose([
            Validators.required
        ]));
        const subcategory = new FormControl('', Validators.compose([
            Validators.required
        ]));
        this.socialProblemForm = this.formBuilder.group({ title, description, subcategory });
        this.ubicationForm = this.formBuilder.group({description_ubication});
        this.errorMessages = this.localDataService.getFormMessagesValidations(validations); 
    }

    async sendSocialProblem() {
        
        if (this.socialProblemForm.valid !== true) {
            await this.utilsService.showToast({message: 'Ingresa un titulo y una descripción'});
            return;
        }
        if (this.ubicationForm.valid !== true) {
            await this.utilsService.showToast({message: 'Ingresa una descripción de tu ubicación'});
            return;
        }
        if (this.socialProblemCoordinate.address === null || this.socialProblemCoordinate.address === null) {
            await this.utilsService.showToast({message: 'No se pudo obtener tu ubicación'});
            return;
        }
        if (this.socialProblemImages.length === 0) {}

        const loadingReportSocialProblem = await this.utilsService.createBasicLoading('Enviando Reporte');

        const ubication = this.socialProblemCoordinate;
        ubication.description = this.ubicationForm.value.description_ubication;

        loadingReportSocialProblem.present();
        const socialProblem: ISocialProblemReported = {
            title: this.socialProblemForm.value.title,
            description: this.socialProblemForm.value.description,
            images: this.socialProblemImages,
            subcategory_id: this.socialProblemForm.value.subcategory,
            ubication
        };
        this.postService.sendSocialProblemReport(socialProblem).pipe(
            finalize(() => {
                loadingReportSocialProblem.dismiss()
            })
        ).subscribe(async res => {
            await this.utilsService.showToast({message: "El Reporte fue enviado correctamente"});
            this.events_app.resetSocialProblemEmmiter();
            this.router.navigate(['/social-problems'])
        }, (err: HttpErrorResponse) => {
                this.utilsService.showToast({ message: 'Ocurrio un error al enviar el reporte' });
            if (err.error instanceof Error) {
                console.log("Client-side error", err);
            } else {
                console.log("Server-side error", err);
            }
        });
    }


    deleteImage(pos: any) {
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

    updateMapCoordinate(event: any) {
        console.log({ datosHijo: event });
        if (event.lat !== null && event.lng !== null) {
            this.socialProblemCoordinate.latitude = event.latitude;
            this.socialProblemCoordinate.longitude = event.longitude;
            this.getUserAddress(this.socialProblemCoordinate.latitude, this.socialProblemCoordinate.longitude);
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
            this.socialProblemCoordinate.address = direccion.display_name;
        },(err: HttpErrorResponse) => {
            if (err.error instanceof Error) {
                console.log("Client-side error", err);
            } else {
                console.log("Server-side error", err);
            }
            this.utilsService.showToast({message: 'No se pudo obtener la dirección de tu ubicación'});
        });
    }

}
