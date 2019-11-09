import { Component, OnInit } from '@angular/core';
import { NotificationsService } from 'src/app/services/notifications.service';
import { NetworkService } from 'src/app/services/network.service';
import { UtilsService } from 'src/app/services/utils.service';
import { IDeviceUser } from 'src/app/interfaces/models';

// declare var moment: any;
// moment.locale('es');


@Component({
    selector: 'app-about',
    templateUrl: './about.page.html',
    styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {
    isConnected = true;
    CurrentUserDevice: IDeviceUser = {
        id: null,
        phone_id: null,
        user_id: null
    };
    constructor(
        private notiService: NotificationsService,
        private networkService: NetworkService,
        private utilsService: UtilsService
    ) {

    }

    async ngOnInit() {
        this.notiService.getUserDevice().subscribe(userdevice => {
            if(userdevice){
                this.CurrentUserDevice = userdevice;
                console.log('current user device about', this.CurrentUserDevice)
            }
        });
        this.networkService.getNetworkStatus().subscribe((connected: boolean) => {
            this.isConnected = connected;
        });
    }


}
