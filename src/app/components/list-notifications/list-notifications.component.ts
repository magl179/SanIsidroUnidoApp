import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NotificationsService } from 'src/app/services/notifications.service';
import { UserService } from 'src/app/services/user.service';
import { take, map, distinctUntilChanged, tap, pluck, catchError, exhaustMap, startWith, skip } from 'rxjs/operators';
import { MapNotification, getCurrentDate } from 'src/app/helpers/utils';
import { PopoverController } from '@ionic/angular';
import { INotificationApi, ICustomEvent, IEventLoad } from 'src/app/interfaces/models';
import { FormControl } from '@angular/forms';
import { of, BehaviorSubject, combineLatest } from 'rxjs';

const URL_PATTERN = new RegExp(/^(http[s]?:\/\/){0,1}(w{3,3}\.)[-a-z0-9+&@#\/%?=~_|!:,.;]*[-a-z0-9+&@#\/%=~_|]/);

@Component({
    selector: 'app-list-notifications',
    templateUrl: './list-notifications.component.html',
    styleUrls: ['./list-notifications.component.scss'],
})
export class ListNotificationsComponent implements OnInit {

    @Input() showListHeader = true;
    @Input() maxNotifications = 0;
    notificationControl: FormControl;
    requestFinished = false;
    notificationsRequested: INotificationApi[] = [];
    notificationsList: INotificationApi[] = [];
    segmentFilter$ = new BehaviorSubject(null);
    @Output() redireccion = new EventEmitter();

    constructor(
        private notiService: NotificationsService,
        private usersService: UserService,
        private popoverCtrl: PopoverController
    ) {
        this.notificationControl = new FormControl();
    }

    ngOnInit() {
        this.notificationsList.reverse();
        this.usersService.resetPagination(this.usersService.PaginationKeys.NOTIFICATIONS);


        const peticionHttpBusqueda = (body) => {
            return this.usersService.getNotificationsUser(body)
                .pipe(
                    pluck('data'),
                    map((data) => {
                        data.forEach((noti) => {
                            noti = MapNotification(noti);
                        });
                        return data;
                    }),
                    catchError(() => of([])),
                )
        }

        combineLatest(
            this.notificationControl.valueChanges.pipe(startWith(''), distinctUntilChanged()),
            this.segmentFilter$.asObservable().pipe(distinctUntilChanged()),
        )
            .pipe(
                skip(1),
                tap(() => {
                    this.requestFinished = false;
                }),
                map(combineValues => ({
                    title: combineValues[0],
                    unreaded: combineValues[1],
                    page: 1
                })),
                exhaustMap(peticionHttpBusqueda),
            )
            .subscribe((data) => {
                this.notificationsList = [...data];
                this.requestFinished = true;
                return this.cargarNotificacionesSolicitadas();
            });

        this.getNotifications();
    }

    getLinesState(indice: number) {
        return ((indice + 1) !== this.notificationsRequested.length) ? 'full' : 'none';
    }

    getNotifications(event: IEventLoad = null) {
        this.usersService.getNotificationsUser().pipe(
            take(1),
            pluck('data'),
            map((data) => {
                data.forEach((noti) => {
                    noti = MapNotification(noti);
                });
                return data;
            }),
            catchError(() => of([])),
        ).subscribe((data: INotificationApi[]) => {
            if (event && event.data && event.data.target && event.data.target.complete) {
                event.data.target.complete();
            }
            if (event && event.data && event.data.target && event.data.target.complete && data.length == 0) {
                event.data.target.disabled = true;
            }
            this.requestFinished = true;
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
                this.cargarNotificacionesSolicitadas();
                return;
            }
        });
    }

    async cargarNotificacionesSolicitadas() {     
        this.notificationsRequested = [...this.notificationsList];
    }

    async manageNoti(noti: INotificationApi): Promise<void> {
        if(noti.read_at == null || noti.read_at == ''){
            this.markNotificationAsReaded(noti.id);
        }
        if (noti && noti.data) {
            this.redireccion.emit({redireccion: true});
            return this.notiService.manageAppNotification(noti.data);
        }
    }

    markNotificationAsReaded(id: number){
        this.usersService.readNotification(id)
        .subscribe(res=>{
            this.notificationsRequested = this.notificationsRequested.map((noti: INotificationApi)=>{
                if(noti.id === id){
                    noti.read_at = getCurrentDate();
                }
                return noti;
            })
        });
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

    segmentChanged(event){
        const value = (event.detail.value !== "") ? Number(event.detail.value) : "";
        this.segmentFilter$.next(value);
    }

    imgError(event): void {
        event.target.src = 'assets/img/default/img_avatar.png'
    }

}
