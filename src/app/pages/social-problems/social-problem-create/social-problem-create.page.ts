import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { UtilsService } from 'src/app/services/utils.service';
import { MapService } from 'src/app/services/map.service';
import { LocalizationService } from 'src/app/services/localization.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { LocalDataService } from 'src/app/services/local-data.service';
import { PostsService } from 'src/app/services/posts.service';
import { ISocialProblemReported, IUbication, IUploadedImages, ISimpleCoordinates } from 'src/app/interfaces/models';
import { finalize } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { CONFIG } from 'src/config/config';
import { ErrorService } from 'src/app/services/error.service';
import { MessagesService } from 'src/app/services/messages.service';
import { UploadImageComponent } from 'src/app/components/upload-image/upload-image.component';
import { NavController } from '@ionic/angular';

@Component({
    selector: 'app-social-problem-create',
    templateUrl: './social-problem-create.page.html',
    styleUrls: ['./social-problem-create.page.scss'],
})
export class SocialProblemCreatePage implements OnInit {

    @ViewChild(UploadImageComponent) uploadImageComponent: UploadImageComponent;
    socialProblemForm: FormGroup;
    ubicationForm: FormGroup;
    errorMessages = null;
    socialProblemImages = [];
    socialProblemCoordinate: IUbication = {
        latitude: null,
        longitude: null,
        address: ''
    };
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
        private navCtrl: NavController
    ) {
        this.createForm();
    }

    loadSubcategories(): void {
        this.postService.getSubcategoriesByCategory(CONFIG.SOCIAL_PROBLEMS_SLUG).subscribe(res => {
            this.subcategories = res.data;
            this.subcategoryName = res.data[0].name;
        }, (error_http: HttpErrorResponse) => {
            this.errorService.manageHttpError(error_http, 'Ocurrio un error al cargar las categorias');
        });
    }

    seeImageDetail(url: string):void {
        this.utilsService.seeImageDetail(url, '');
    }

    async ngOnInit(): Promise<void> {
        this.loadSubcategories();
    }

    ionViewDidEnter(){
        this.localizationService.getCoordinates().then((coordinates: ISimpleCoordinates) => {
            this.socialProblemCoordinate.latitude = coordinates.latitude;
            this.socialProblemCoordinate.longitude = coordinates.longitude;
            this.cdRef.detectChanges();
            this.getUserAddress(coordinates.latitude, coordinates.longitude);
        }).catch(() => {
            this.socialProblemCoordinate.latitude = CONFIG.DEFAULT_LOCATION.latitude;
            this.socialProblemCoordinate.longitude = CONFIG.DEFAULT_LOCATION.longitude;
            this.cdRef.detectChanges();
            this.getUserAddress(this.socialProblemCoordinate.latitude, this.socialProblemCoordinate.longitude);
        });
    }

    createForm(): void {
        const validations = this.localDataService.getFormValidations();
        const title = new FormControl('', Validators.compose([
            Validators.required,
            Validators.maxLength(validations.title.maxlength)
        ]));
        const description = new FormControl('', Validators.compose([
            Validators.required,
            Validators.maxLength(validations.description.maxlength)
        ]));
        const description_ubication = new FormControl('', Validators.compose([
            Validators.required,
            Validators.maxLength(validations.ubication.description.maxlength)
        ]));
        const subcategory = new FormControl('', Validators.compose([
            Validators.required
        ]));
        this.socialProblemForm = this.formBuilder.group({ title, description, subcategory });
        this.ubicationForm = this.formBuilder.group({ description_ubication });
        this.errorMessages = this.localDataService.getFormMessagesValidations(validations);
    }

    async sendSocialProblem(): Promise<null> {

        if (this.socialProblemForm.valid !== true) {
            this.messageService.showInfo("Ingresa un titulo y una descripción");
            return null;
        }
        if (this.ubicationForm.valid !== true) {
            this.messageService.showInfo("Ingresa una descripción de tu ubicación");
            return null;
        }
        if (this.socialProblemCoordinate.address === null) {
            this.messageService.showInfo("No se pudo obtener tu ubicación");
            return null;
        }

        if (this.socialProblemImages.length == 0) {
            this.messageService.showInfo("Debes subir al menos una imagen acerca del reporte");
            return null;
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
        ).subscribe(() => {
            this.messageService.showSuccess("Reporte enviado correctamente, cuando sea aprobado lo podrás visualizar en el listado");
            //Ejecutar la deteccion de cambios de Angular de forma manual
           
            const social_problem_subcategory = this.getSubcategoryById(this.socialProblemForm.value.subcategory);

              //Resetear datos al enviar
            this.socialProblemForm.reset();
            this.ubicationForm.reset();
            this.socialProblemImages = [];
            this.socialProblemCoordinate.address = null;
            this.formSended = false;
            this.cdRef.detectChanges();      
            if (social_problem_subcategory && social_problem_subcategory.length > 0) {
                    this.navCtrl.navigateRoot(`/social-problems/list/${social_problem_subcategory[0]}`);
            }

        }, (error_http: HttpErrorResponse) => {
            this.errorService.manageHttpError(error_http, 'Ocurrio un error al enviar tu reporte, intentalo más tarde');
        });
    }

    getSubcategoryById(id: number): string[] {
        return this.subcategories.filter(subcategory => subcategory.id == id).map(subcategory => subcategory.slug)
    }


    deleteImage(index: number): void {
        this.socialProblemImages.splice(index, 1);
        this.uploadImageComponent.deleteImage(index);
    }

    getUploadedImages(event: IUploadedImages): void {
        this.socialProblemImages = event.uploaded_images;
    }

    updateMapCoordinate(event: ISimpleCoordinates): void {
        if (event.latitude !== null && event.longitude !== null) {
            this.socialProblemCoordinate.latitude = event.latitude;
            this.socialProblemCoordinate.longitude = event.longitude;
            this.getUserAddress(this.socialProblemCoordinate.latitude, this.socialProblemCoordinate.longitude);
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
            this.socialProblemCoordinate.address = direccion.display_name;
            this.cdRef.detectChanges();
        }, (error_http: HttpErrorResponse) => {
            this.errorService.manageHttpError(error_http, 'Ocurrio un error al obtener tu dirección, intentalo más tarde');
        });
    }

    changeSubcategoryName(event: CustomEvent): void {
        this.subcategoryName = this.subcategories.filter(subcategory => subcategory.id == event.detail.value).map(subcategory => subcategory.name);
    }



}
