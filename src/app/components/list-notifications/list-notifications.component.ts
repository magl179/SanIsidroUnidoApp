import { Component, OnInit, Input } from '@angular/core';
import { NotificationsService } from 'src/app/services/notifications.service';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';
import { take, finalize, map } from 'rxjs/operators';
import { MapNotification } from 'src/app/helpers/utils';
import { PopoverController } from '@ionic/angular';
import { NotiList } from 'src/app/interfaces/models';


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

    notificationsRequested: NotiList[] = [];
    notificationsList: NotiList[] = [];

    constructor(
        private notiService: NotificationsService,
        private usersService: UserService,
        private popoverCtrl: PopoverController
    ) { }

    ngOnInit() {
        this.notificationsList.reverse();
        this.getNotifications();
    }

    getLinesState(indice: number) {
        return ((indice + 1) !== this.notificationsRequested.length) ? 'full' : 'none';
    }

    getNotifications() {
        this.usersService.getNotificationsUser().pipe(
            take(1), 
            map((res: any) => {
            res.data.forEach((noti: any) => {
                noti = MapNotification(noti);
            });
            return res;
            }),
            finalize(()=>{
                this.requestFinished = true;
            })
        ).subscribe((res: any) => {
            this.notificationsList = res.data;
            this.cargarNotificacionesSolicitadas();
        });
    }

    async cargarNotificacionesSolicitadas() {;
        if (this.maxNotifications === 0) {
            this.notificationsRequested = this.notificationsList;
        } else {
            this.notificationsRequested = this.notificationsList.slice(0, (this.maxNotifications));
        }
        //Filtrar Notificaciones Leidas
        if(this.getUnreaded){
            this.notificationsRequested = this.notificationsRequested.filter(noti => noti.read_at == null);
        }
        console.log('Noti Requested', this.notificationsRequested);
        
    }

    async manageNoti(noti: any) {
        alert('en construccion...');
        return;
        if (noti && noti.additional_data) {
            await this.popoverCtrl.dismiss();
            this.notiService.manageAppNotification(noti.additional_data);
        }
    }

}
