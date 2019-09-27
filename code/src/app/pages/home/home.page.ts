import { Component, OnInit } from '@angular/core';
import { UtilsService } from '../../services/utils.service';
import { LocalDataService } from '../../services/local-data.service';
import { AuthService } from '../../services/auth.service';
import { IHomeOptions } from 'src/app/interfaces/models';
import { NetworkService } from '../../services/network.service';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

    servicesList: IHomeOptions[] = [];

    constructor(
        private utilsService: UtilsService,
        private localDataService: LocalDataService,
        private networkService: NetworkService
    ) { }

    async ngOnInit() {
        this.localDataService.getHomeOptions().subscribe((data) => {
            this.servicesList = data;
            console.log('items home: ', data.length);
        });
        await this.utilsService.enableMenu();
    }

    onClearBDD() {
        this.utilsService.clearBDD();
    }

}
