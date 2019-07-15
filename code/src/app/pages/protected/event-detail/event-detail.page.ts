import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UtilsService } from 'src/app/services/utils.service';

import { ISimpleUbicationItem } from 'src/app/interfaces/barrios';

@Component({
    selector: 'app-event-detail',
    templateUrl: './event-detail.page.html',
    styleUrls: ['./event-detail.page.scss'],
})
export class EventDetailPage implements OnInit {

    id: string;

    mapPoints: ISimpleUbicationItem = {
        latitude: 0.0456696,
        longitude: -78.14502999999999,
        title: 'Ubicación del Evento'
    };

    constructor(
        private route: ActivatedRoute,
        private utilsService: UtilsService) { }

    ngOnInit() {
        this.id = this.route.snapshot.paramMap.get('id');
        console.log('ID RECIBIDO:', this.id);
    }

    test() {
        this.utilsService.showToast();
    }

}
