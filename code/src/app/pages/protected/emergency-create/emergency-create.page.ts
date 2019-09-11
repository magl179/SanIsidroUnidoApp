import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { UtilsService } from '../../../services/utils.service';
import { MapService } from 'src/app/services/map.service';
import { IPostUbicationItem } from 'src/app/interfaces/barrios';
import { LocalizationService } from '../../../services/localization.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { IEmergencyReported, IUbication } from 'src/app/interfaces/models';
import { PostsService } from '../../../services/posts.service';
import { LocalDataService } from '../../../services/local-data.service';
import { finalize } from 'rxjs/operators';
import { fakeAsync } from '@angular/core/testing';
import { NetworkService } from '../../../services/network.service';
import { NavController } from '@ionic/angular';


// type PaneType = 'left' | 'right';

@Component({
    selector: 'app-emergency-create',
    templateUrl: './emergency-create.page.html',
    styleUrls: ['./emergency-create.page.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmergencyCreatePage implements OnInit {

    // appNetworkConnection = false;
    currentStep = 2;
    // emergencyPostValid = false;
    // activePane: PaneType = 'left';
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
        private localizationService: LocalizationService,
        private postService: PostsService,
        private navCtrl: NavController,
        private networkService: NetworkService,
        private localDataService: LocalDataService
    ) {
        this.createForm();
    }

    async ngOnInit() {
        // this.networkService.getNetworkStatus().subscribe((connected: boolean) => {
        //     this.appNetworkConnection = connected;
        // });
        const coords = await this.localizationService.getCoordinate();
        this.emergencyPostCoordinate.latitude = coords.latitude;
        this.emergencyPostCoordinate.longitude = coords.longitude;
        // console.log(this.emergencyPostCoordinate);
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
            this.emergencyPostCoordinate.latitude = event.latitude;
            this.emergencyPostCoordinate.longitude = event.longitude;
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
            this.utilsService.showToast('No se pudo obtener la dirección de tu ubicación');
        });
    }

    async sendEmergencyReport() { 
        if (this.emergencyForm.valid !== true) {
            await this.utilsService.showToast('Ingresa un titulo y una descripción', 2500);
            return;
        }

        if (this.ubicationForm.valid !== true) {
            await this.utilsService.showToast('Ingresa una descripción de la ubicación', 2500);
            return;
        }

        if (this.emergencyPostCoordinate.address === null || this.emergencyPostCoordinate.address === null) {
            await this.utilsService.showToast('No se pudo obtener tu ubicación', 2500);
            return;
        }

        const loadingEmergencyReport = await this.utilsService.createBasicLoading('Enviando Reporte');
        loadingEmergencyReport.present();
        const socialProblem: IEmergencyReported = {
            title: this.emergencyForm.value.title,
            description: this.emergencyForm.value.description,
            ubication: this.emergencyPostCoordinate,
            images: this.emergencyImages,
            description_ubication: this.ubicationForm.value.description_ubication
        };

        this.postService.sendEmergencyReport(socialProblem).pipe(
            finalize(() => {
                loadingEmergencyReport.dismiss()
            })
        ).subscribe(async res => {
            await this.utilsService.showToast("El Reporte fue enviado correctamente");
            this.navCtrl.navigateRoot('/home');
        }, err => {
            const message_error = (err.error.message) ? err.error.message :'Ocurrio un error al reportar la emergencia';
            this.utilsService.showToast(message_error);
            console.log('Ocurrio un error al reportar la emergencia', message_error);
        });
    }



}
