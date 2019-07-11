import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-list-notifications',
    templateUrl: './list-notifications.component.html',
    styleUrls: ['./list-notifications.component.scss'],
})
export class ListNotificationsComponent implements OnInit {


    @Input() showListHeader = true;
    @Input() maxNotifications = 0;

    notificationsRequested = [];
    notificationsList = [
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

    constructor() { }

    async ngOnInit() {
        await this.notificationsList.reverse();
        await this.cargarNotificacionesSolicitadas()
    }

    getLinesState(indice) {
        return ((indice + 1) !== this.notificationsRequested.length) ? 'full' : 'none';
    }

    cargarNotificacionesSolicitadas() {
        if (this.maxNotifications === 0) {
            this.notificationsRequested = this.notificationsList;
        } else {
            // inicio-fin
            this.notificationsRequested = this.notificationsList.slice(0, (this.maxNotifications));
        }
        console.log(this.notificationsRequested);
    }

}
