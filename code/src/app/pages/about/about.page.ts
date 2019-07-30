import { Component, OnInit } from '@angular/core';
import { NotificationsService } from 'src/app/services/notifications.service';
import { NetworkService } from 'src/app/services/network.service';
import { UtilsService } from '../../services/utils.service';

// declare var moment: any;
// moment.locale('es');


@Component({
    selector: 'app-about',
    templateUrl: './about.page.html',
    styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {
    isConnected = true;
    infodeviceID = null;
    constructor(
        private notiService: NotificationsService,
        private networkService: NetworkService,
        private utilsService: UtilsService
    ) {

    }

    async ngOnInit() {
        this.notiService.getIDSubscriptor().subscribe(data => {
            if (data) {
                this.infodeviceID = data;
            }
        });
        await this.networkService.testNetworkConnection();
        const isOnline = this.networkService.getNetworkTestValue();
        this.isConnected = isOnline;
        this.networkService.getNetworkStatus().subscribe((connected: boolean) => {
            this.isConnected = connected;
        });
    }


}
