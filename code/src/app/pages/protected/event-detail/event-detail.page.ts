import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UtilsService } from 'src/app/services/utils.service';

import { ISimpleUbicationItem } from 'src/app/interfaces/barrios';
import { IEventDetail } from 'src/app/interfaces/models';
import { PostsService } from '../../../services/posts.service';


@Component({
    selector: 'app-event-detail',
    templateUrl: './event-detail.page.html',
    styleUrls: ['./event-detail.page.scss'],
})
export class EventDetailPage implements OnInit {

    id: string;

    event:IEventDetail = null;

    mapPoints: ISimpleUbicationItem = {
        latitude: 0.0456696,
        longitude: -78.14502999999999,
        title: 'Ubicación del Evento'
    };

    constructor(
        private route: ActivatedRoute,
        private utilsService: UtilsService,
        private postService: PostsService) { }

    ngOnInit() {
        this.id = this.route.snapshot.paramMap.get('id');
        console.log('ID RECIBIDO:', this.id);
        this.postService.getEvent(+this.id).subscribe(res => {
            this.event = res.data;
            console.log('res post', res);
            console.log('Dato post', this.event);
        });
    }

    test() {
        this.utilsService.showToast();
    }

}
