import { Component, OnInit} from '@angular/core';
import { UtilsService } from '../../../services/utils.service';
import { MapaService } from 'src/app/services/mapa.service';
import { PostUbicationItem } from 'src/app/interfaces/barrios';
import { LocalizationService } from '../../../services/localization.service';

@Component({
    selector: 'app-social-problem-create',
    templateUrl: './social-problem-create.page.html',
    styleUrls: ['./social-problem-create.page.scss'],
})
export class SocialProblemCreatePage implements OnInit {


    currentStep = 3;
    fullFormIsValid = false;
    // activePane: PaneType = 'left';
    socialProblemFormStage = [
        { title: 'Paso 1' }, { title: 'Paso 2' },
        { title: 'Paso 3' }, { title: 'Paso 4' }
    ];
    socialProblemImages = [];
    postCoordinate: PostUbicationItem = {
        latitude: null,
        longitude: null,
        address: null
    };
    // puntosUbicacion: SimpleUbicationItem;

    constructor(
        private utilsService: UtilsService,
        private mapaService: MapaService,
        private localizationService: LocalizationService
    ) { }

    async ngOnInit() {
        const coords = await this.localizationService.obtenerCoordenadas();
        this.postCoordinate.latitude = coords.latitud;
        this.postCoordinate.longitude = coords.longitud;
    }


    retrocederEtapa() {
        if (this.currentStep > 1) {
            this.currentStep--;
        }
    }
    avanzarEtapa() {
        const tamanioEtapas = Object.keys(this.socialProblemFormStage).length;
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
            this.postCoordinate.latitude = event.lat;
            this.postCoordinate.longitude = event.lng;
            this.obtenerDireccionUsuario(this.postCoordinate.latitude, this.postCoordinate.longitude);
        }

    }

    updateCurrentStep(event) {
        this.currentStep = event.currentStep;
    }

    async obtenerDireccionUsuario(latitud, longitud) {
        await this.mapaService.getAddress({
            lat: latitud,
            lng: longitud,
            zoom: 14
        }).subscribe(direccion => {
            console.log({ add: direccion });
            this.postCoordinate.address = direccion.display_name;
        },
            err => {
                console.log('Ocurrio un error al obtener la ubicación: ', err);
            });
    }

}
