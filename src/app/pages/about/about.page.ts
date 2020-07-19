import { Component, OnInit } from '@angular/core';
import { NotificationsService } from 'src/app/services/notifications.service';
import { NetworkService } from 'src/app/services/network.service';
import { IDeviceUser } from 'src/app/interfaces/models';
import { CONFIG } from 'src/config/config';

@Component({
    selector: 'app-about',
    templateUrl: './about.page.html',
    styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {
    isConnected = true;
    config = CONFIG;
    constructor(
        private networkService: NetworkService,
    ) {

    }

    async ngOnInit() {      
        this.networkService.getNetworkStatus().subscribe((connected: boolean) => {
            this.isConnected = connected;
        });
    }


}
