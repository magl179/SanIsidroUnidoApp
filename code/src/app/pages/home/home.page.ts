import { Component, OnInit } from '@angular/core';
import { UtilsService } from '../../services/utils.service';
import { LocalDataService } from '../../services/local-data.service';
import { AuthService } from '../../services/auth.service';
import { IHomeOptions } from 'src/app/interfaces/models';
import { NetworkService } from '../../services/network.service';
import { Observable } from 'rxjs';
// export interface MenuServices {
//     title: string;
//     icon: string;
//     url: string;
//     valid_roles: string[];
// }

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
    appNetworkConnection = false;
    // appNetworkConnection: Observable<boolean>;
    servicesList: IHomeOptions[] = [];

    constructor(
        private utilsService: UtilsService,
        private localDataService: LocalDataService,
        private authService: AuthService,
        private networkService: NetworkService
    ) { }

    async ngOnInit() {
        // this.appNetworkConnection = this.networkService.getNetworkStatus();
       
        this.networkService.getNetworkStatus().subscribe((connected: boolean) => {
            this.appNetworkConnection = connected;
        });
        await this.localDataService.getHomeOptions().subscribe((data) => {
            this.servicesList = data;
            console.log('items home: ', data.length);
        });
        await this.utilsService.enableMenu();
    }

    onClearBDD() {
        this.utilsService.clearBDD();
    }

}
