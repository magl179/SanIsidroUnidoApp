import { Component, OnInit } from '@angular/core';
import { NotificationsService } from 'src/app/services/notifications.service';
import { NetworkService } from 'src/app/services/network.service';

@Component({
    selector: 'app-about',
    templateUrl: './about.page.html',
    styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {
    isConnected = false;
    infodeviceID = null;
    constructor(
        private notiService: NotificationsService,
        private networkService: NetworkService
    ) {
        this.networkService.getNetworkStatus().subscribe((connected: boolean) => {
            this.isConnected = connected;
        });
    }

    ngOnInit() {
        this.notiService.getIDSubscriptor().subscribe(data => {
            if (data) {
                this.infodeviceID = data;
            }
        });
    }

}
