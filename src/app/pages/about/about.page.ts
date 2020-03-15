import { Component, OnInit } from '@angular/core';
import { NotificationsService } from 'src/app/services/notifications.service';
import { NetworkService } from 'src/app/services/network.service';
import { UtilsService } from 'src/app/services/utils.service';
import { IDeviceUser } from 'src/app/interfaces/models';
import { CONFIG } from 'src/config/config';

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
    config = CONFIG;
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
            }
        });
        this.networkService.getNetworkStatus().subscribe((connected: boolean) => {
            this.isConnected = connected;
        });
    }


}
