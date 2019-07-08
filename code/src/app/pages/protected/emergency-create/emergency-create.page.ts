import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { UtilsService } from '../../../services/utils.service';
import { MapaService } from 'src/app/services/mapa.service';
import { PostUbicationItem } from 'src/app/interfaces/barrios';
import { LocalizationService } from '../../../services/localization.service';
import { FormGroup, FormBuilder, FormControl, Validators  } from '@angular/forms';


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
        email: {
            required: true,
            minlength: 3,
            maxlength: 15
        },
        password: {
            required: true,
            minlength: 8,
            maxlength: 30
        }
    };
    
    // puntosUbicacion: SimpleUbicationItem;

    constructor(
        private utilsService: UtilsService,
        private mapaService: MapaService,
        public formBuilder: FormBuilder,
        private localizationService: LocalizationService
    ) {
        this.crearFormulario();
        this.cargarMensajesError();
     }

    async ngOnInit() {
        const coords = await this.localizationService.obtenerCoordenadas();
        this.emergencyPostCoordinate.latitude = coords.latitud;
        this.emergencyPostCoordinate.longitude = coords.longitud;
        console.log(this.emergencyForm.get('title').value);
    }

    crearFormulario() {
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

    cargarMensajesError() {
        this.errorMessages = {
            title: {
                required: {
                    message: 'El titulo es Obligatorio'
                },
                minlength: {
                    message: `El titulo debe contener minimo ${this.emergencyFormFields.email.minlength} caracteres`
                },
                maxlength: {
                    message: `El titulo debe contener máximo ${this.emergencyFormFields.email.maxlength} caracteres`
                }
            },
            description: {
                required: {
                    message: 'La descripción es Obligatoria'
                },
                minlength: {
                    message: `La descripción debe contener minimo ${this.emergencyFormFields.password.minlength} caracteres`
                },
                maxlength: {
                    message: `La descripción debe contener máximo ${this.emergencyFormFields.password.maxlength} caracteres`
                }
            }
        };

    }

    obtenerImagenesSubidas(event) {
        console.log(event);
        this.emergencyImages = event.total_img;
    }


    retrocederEtapa() {
        if (this.currentStep > 1) {
            this.currentStep--;
        }
    }
    avanzarEtapa() {
        const tamanioEtapas = Object.keys(this.emergencyFormStage).length;
        if (this.currentStep < (tamanioEtapas)) {
            this.currentStep++;
        }
    }


    validarFase1() {
        this.avanzarEtapa();
    }

    validarFase2() {
        this.avanzarEtapa();
    }
    validarFase3() {
        this.avanzarEtapa();
    }

    actualizarCoordenasMapa(event) {
        console.log({ datosHijo: event });
        if (event.lat !== null && event.lng !== null) {
            this.emergencyPostCoordinate.latitude = event.lat;
            this.emergencyPostCoordinate.longitude = event.lng;
            this.obtenerDireccionUsuario(this.emergencyPostCoordinate.latitude, this.emergencyPostCoordinate.longitude);
        }

    }

    updateCurrentStep(event) {
        this.currentStep = event.currentStep;
    }

    obtenerDireccionUsuario(latitud, longitud) {
        this.mapaService.getAddress({
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

    async enviarReporteEmergencia() {
        if (this.emergencyForm.valid !== true) {
            await this.utilsService.mostrarToast('Ingresa un titulo y una descripción', 2500);
            return;
        }
        if (this.emergencyImages.length === 0) {
            await this.utilsService.mostrarToast('Sube alguna imagen por favor', 2500);
            return;
        }
        if (this.emergencyPostCoordinate.address === null || this.emergencyPostCoordinate.address === null) {
            await this.utilsService.mostrarToast('No se pudo obtener tu ubicación', 2500);
            return;
        }

        await this.utilsService.mostrarToast('Post Emergencia Valido', 2500);
    }



}
