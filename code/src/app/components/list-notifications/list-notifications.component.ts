import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { NotificationsService } from '../../services/notifications.service';
import { Observable } from 'rxjs';
import { NavController, IonSegment } from '@ionic/angular';

@Component({
    selector: 'app-list-notifications',
    templateUrl: './list-notifications.component.html',
    styleUrls: ['./list-notifications.component.scss'],
})
export class ListNotificationsComponent implements OnInit {

    @Input() showListHeader = true;
    @Input() maxNotifications = 0;
    @ViewChild(IonSegment) segment: IonSegment;

    notificationsRequested = [];
    notificationsList: { title: string, author: string, user_img: string, description: string }[] = [];
    notificationsList2: {title: string, author: string, user_img: string, description: string}[] = [
        // tslint:disable-next-line: max-line-length
        { title: 'Title Noti 1', author: 'Juan Manuel', user_img: 'assets/img/default/img_avatar.png', description: 'Descripcion de la Noti' },
        // tslint:disable-next-line: max-line-length
        { title: 'Title Noti 2', author: 'Rosa Mendez', user_img: 'assets/img/default/img_avatar.png', description: 'Descripcion de la Noti' },
        // tslint:disable-next-line: max-line-length
        { title: 'Title Noti 3', author: 'Juan Manuel', user_img: 'assets/img/default/img_avatar.png', description: 'Descripcion de la Noti' },
        // tslint:disable-next-line: max-line-length
        { title: 'Title Noti 4', author: 'Juan Manuel', user_img: 'assets/img/default/img_avatar.png', description: 'Descripcion de la Noti' },
        // tslint:disable-next-line: max-line-length
        { title: 'Title Noti 5', author: 'Juan Manuel', user_img: 'assets/img/default/img_avatar.png', description: 'Descripcion de la Noti' },
        // tslint:disable-next-line: max-line-length
        { title: 'Title Noti  6', author: 'Juan Manuel', user_img: 'assets/img/default/img_avatar.png', description: 'Descripcion de la Noti' },
        // tslint:disable-next-line: max-line-length
        { title: 'Title Noti 7', author: 'Juan Manuel', user_img: 'assets/img/default/img_avatar.png', description: 'Descripcion de la Noti' }
    ];

    constructor(
        private notiService: NotificationsService
    ) { }

    async ngOnInit() {
        this.segment.value = 'todos';
        await this.notificationsList.reverse();
        await this.getNotifications();
    }

    getLinesState(indice) {
        return ((indice + 1) !== this.notificationsRequested.length) ? 'full' : 'none';
    }

    getNotifications() {
        this.notiService.getNotifications().subscribe(async data => {
            console.log('Data noti: ', data);
            if (data) {
                this.notificationsList = data;
            }
            this.cargarNotificacionesSolicitadas();
        });
    }

    async cargarNotificacionesSolicitadas() {
        console.log('Noti Solicited Load', this.notificationsList);
        if (this.maxNotifications === 0) {
            this.notificationsRequested = this.notificationsList;
        } else {
            this.notificationsRequested = this.notificationsList.slice(0, (this.maxNotifications));
        }
        console.log('Noti Requested', this.notificationsRequested);
    }

}
