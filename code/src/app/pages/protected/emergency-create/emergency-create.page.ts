import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { UtilsService } from '../../../services/utils.service';
import { MapaService } from 'src/app/services/mapa.service';
import { PostUbicationItem } from 'src/app/interfaces/barrios';

// type PaneType = 'left' | 'right';

@Component({
    selector: 'app-emergency-create',
    templateUrl: './emergency-create.page.html',
    styleUrls: ['./emergency-create.page.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmergencyCreatePage implements OnInit {

    currentStep = 3;
    // activePane: PaneType = 'left';
    emergencyFormStage = [
        { title: 'Paso 1'}, { title: 'Paso 2' },
        { title: 'Paso 3' }, { title: 'Paso 4' }
    ];
    emergencyImages = [];
    postCoordinate: PostUbicationItem = {
        latitude: null,
        longitude: null,
        address: null
    };
    // puntosUbicacion: SimpleUbicationItem;

    constructor(
        private utilsService: UtilsService,
        private mapaService: MapaService
    ) { }

    async ngOnInit() {
        const coords = await this.utilsService.obtenerCoordenadas();
        this.postCoordinate.latitude = coords.latitud;
        this.postCoordinate.longitude = coords.longitud;
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
            this.postCoordinate.latitude = event.lat;
            this.postCoordinate.longitude = event.lng;
            this.obtenerDireccionUsuario(this.postCoordinate.latitude, this.postCoordinate.longitude)
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
            this.postCoordinate.address = direccion.display_name;
        },
            err => {
                console.log('Ocurrio un error al obtener la ubicación: ', err);
        });
    }



}
