import { Component, OnInit, Input } from '@angular/core';
import { NotificationsService } from 'src/app/services/notifications.service';
import { UserService } from 'src/app/services/user.service';
import { take, finalize, map } from 'rxjs/operators';
import { MapNotification } from 'src/app/helpers/utils';
import { PopoverController } from '@ionic/angular';
import { INotificationApi } from 'src/app/interfaces/models';

const URL_PATTERN = new RegExp(/^(http[s]?:\/\/){0,1}(w{3,3}\.)[-a-z0-9+&@#\/%?=~_|!:,.;]*[-a-z0-9+&@#\/%=~_|]/);

@Component({
    selector: 'app-list-notifications',
    templateUrl: './list-notifications.component.html',
    styleUrls: ['./list-notifications.component.scss'],
})
export class ListNotificationsComponent implements OnInit {

    @Input() showListHeader = true;
    @Input() maxNotifications = 0;
    @Input() getUnreaded = false;

    requestFinished = false;

    notificationsRequested: INotificationApi[] = [];
    notificationsList: INotificationApi[] = [];

    constructor(
        private notiService: NotificationsService,
        private usersService: UserService,
        private popoverCtrl: PopoverController
    ) { }

    ngOnInit() {
        this.notificationsList.reverse();
        this.usersService.resetPagination(this.usersService.PaginationKeys.NOTIFICATIONS);
        this.getNotifications();
    }

    getLinesState(indice: number) {
        return ((indice + 1) !== this.notificationsRequested.length) ? 'full' : 'none';
    }

    getNotifications(event: any = null, first_loading = false) {
        this.usersService.getNotificationsUser().pipe(
            take(1),
            map((res: any) => {
                res.data.forEach((noti: any) => {
                    noti = MapNotification(noti);
                });
                return res;
            }),
            finalize(() => {
                this.requestFinished = true;
            })
        ).subscribe((res: any) => {
            let data = [];
            data = res.data;
            //Evento Completar
            if (event && event.data && event.data.target && event.data.target.complete) {
                event.data.target.complete();
            }
            if (event && event.data && event.data.target && event.data.target.complete && data.length == 0) {
                event.data.target.disabled = true;
            }
            if (event && event.type == 'refresher') {
                this.notificationsList.unshift(...data);
                this.cargarNotificacionesSolicitadas();
                return;
            } else if (event && event.type == 'infinite_scroll') {
                this.notificationsList.push(...data);
                this.cargarNotificacionesSolicitadas();
                return;
            } else {
                this.notificationsList.push(...data);
                // this.emergenciesFiltered.push(...this.emergenciesList);
                this.cargarNotificacionesSolicitadas();
                return;
            }
            // this.notificationsList = data;
        });
    }

    async cargarNotificacionesSolicitadas() {
        ;
        if (this.maxNotifications === 0) {
            this.notificationsRequested = this.notificationsList;
        } else {
            this.notificationsRequested = this.notificationsList.slice(0, (this.maxNotifications));
        }
        //Filtrar Notificaciones Leidas
        if (this.getUnreaded) {
            this.notificationsRequested = this.notificationsRequested.filter(noti => noti.read_at == null);
        }
    }

    async manageNoti(noti: INotificationApi) {
        if (noti && noti.data) {
            await this.popoverCtrl.dismiss();
            this.notiService.manageAppNotification(noti.data);
        }
    }

    doRefresh(event) {
        this.getNotifications({
            type: 'infinite_scroll',
            data: event
        });
    }

    getInfiniteScrollData(event) {
        this.getNotifications({
            type: 'refresher',
            data: event
        });
    }

}
