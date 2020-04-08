import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { UtilsService } from 'src/app/services/utils.service';
import { MapService } from 'src/app/services/map.service';
import { LocalizationService } from 'src/app/services/localization.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { LocalDataService } from 'src/app/services/local-data.service';
import { PostsService } from 'src/app/services/posts.service';
import { ISocialProblemReported, IUbication } from 'src/app/interfaces/models';
import { finalize, timeout, delay } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { IRespuestaApiSIU } from "src/app/interfaces/models";
import { CONFIG } from 'src/config/config';
import { ErrorService } from 'src/app/services/error.service';
import { MessagesService } from 'src/app/services/messages.service';
import { interval, from } from 'rxjs';
import { Router } from '@angular/router';

@Component({
    selector: 'app-social-problem-create',
    templateUrl: './social-problem-create.page.html',
    styleUrls: ['./social-problem-create.page.scss'],
})
export class SocialProblemCreatePage implements OnInit {

    socialProblemForm: FormGroup;
    ubicationForm: FormGroup;
    errorMessages = null;
    socialProblemImages = [];
    socialProblemCoordinate: IUbication = {
        latitude: null,
        longitude: null,
        address: null
    };
    // coordinates = n
    subcategories = [];
    formSended = false;
    subcategoryName = null;

    constructor(
        private utilsService: UtilsService,
        private errorService: ErrorService,
        private mapService: MapService,
        private cdRef: ChangeDetectorRef,
        private messageService: MessagesService,
        public formBuilder: FormBuilder,
        private localizationService: LocalizationService,
        private localDataService: LocalDataService,
        private postService: PostsService,
        private router: Router
    ) {
        this.createForm();
    }

    loadSubcategories() {
        this.postService.getSubcategoriesByCategory(CONFIG.SOCIAL_PROBLEMS_SLUG).subscribe(res => {
            this.subcategories = res.data;
            this.subcategoryName = res.data[0].name;
        }, (err: HttpErrorResponse) => {
            this.errorService.manageHttpError(err, 'Ocurrio un error al cargar las categorias');
        });
    }

    async ngOnInit() {
        this.loadSubcategories();

        await this.localizationService.getCoordinates().then((coordinates: any) => {
            this.socialProblemCoordinate.latitude = coordinates.latitude;
            this.socialProblemCoordinate.longitude = coordinates.longitude;
        }).catch(err => {
            console.error('Error al obtener geolocalizacion', err);
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
        this.ubicationForm = this.formBuilder.group({ description_ubication });
        this.errorMessages = this.localDataService.getFormMessagesValidations(validations);
    }

    async sendSocialProblem() {

        if (this.socialProblemForm.valid !== true) {
            return this.messageService.showInfo("Ingresa un titulo y una descripción");
        }
        if (this.ubicationForm.valid !== true) {
            return this.messageService.showInfo("Ingresa una descripción de tu ubicación");
        }
        if (this.socialProblemCoordinate.address === null) {
            return this.messageService.showInfo("No se pudo obtener tu ubicación");
        }

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
        ).subscribe(async (res: any) => {
            this.messageService.showSuccess("El Reporte fue enviado correctamente");
            this.formSended = true;
            //Ejecutar la deteccion de cambios de Angular de forma manual
            this.cdRef.detectChanges();
            // const social_problem_id_created = (res && res.id) ? res.id : null;
            const social_problem_subcategory = this.getSubcategoryById(this.socialProblemForm.value.subcategory);
            if(social_problem_subcategory && social_problem_subcategory.length > 0){
                setTimeout(()=>{
                    // this.router.navigateByUrl(`/social-problems/list/espacios_verdes/${social_problem_id_created}`);
                    this.router.navigateByUrl(`/social-problems/list/${social_problem_subcategory[0]}`);
                }, 1000);
            }

        }, (err: HttpErrorResponse) => {
            this.errorService.manageHttpError(err, 'Ocurrio un error al enviar tu reporte, intentalo más tarde');
        });
    }

    getSubcategoryById(id: number){
        return this.subcategories.filter(subcategory=> subcategory.id == id).map(subcategory=> subcategory.slug)
    }


    deleteImage(pos: any) {
        this.socialProblemImages.splice(pos, 1);
    }

    getUploadedImages(event) {
        this.socialProblemImages = event.total_img;
    }

    updateMapCoordinate(event: any) {
        if (event.lat !== null && event.lng !== null) {
            this.socialProblemCoordinate.latitude = event.latitude;
            this.socialProblemCoordinate.longitude = event.longitude;
            this.getUserAddress(this.socialProblemCoordinate.latitude, this.socialProblemCoordinate.longitude);
        }
    }

    getUserAddress(latitud: number, longitud: number) {
        this.mapService.getAddress({
            lat: latitud,
            lng: longitud,
            zoom: 14
        }).subscribe(direccion => {
            this.socialProblemCoordinate.address = direccion.display_name;
            this.cdRef.detectChanges();
        }, (err: HttpErrorResponse) => {
            this.errorService.manageHttpError(err, 'Ocurrio un error al obtener tu dirección, intentalo más tarde');
        });
    }

    changeSubcategoryName(event) {
        this.subcategoryName = this.subcategories.filter(subcategory => subcategory.id == event.detail.value).map(subcategory => subcategory.name);
    }



}
