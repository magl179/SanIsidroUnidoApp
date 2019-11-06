import { Component, OnInit } from '@angular/core';
import { UtilsService } from 'src/app/services/utils.service';
import { LocalDataService } from 'src/app/services/local-data.service';
import { AuthService } from 'src/app/services/auth.service';
import { IHomeOptions } from 'src/app/interfaces/models';
import { NetworkService } from 'src/app/services/network.service';
// import { Observable } from 'rxjs';
// import { threadId } from 'worker_threads';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

    servicesList: IHomeOptions[] = [];
    sessionAuth = null;

    constructor(
        private utilsService: UtilsService,
        private localDataService: LocalDataService,
        private networkService: NetworkService,
        private authService: AuthService
    ) { }

    async ngOnInit() {
        this.authService.sessionAuthUser.subscribe((token_decoded: any) => {
            if (token_decoded) {
                this.sessionAuth = token_decoded;
            }
        });
        this.localDataService.getHomeOptions().subscribe((data: any) => {
            this.servicesList = data;
        });
        await this.utilsService.enableMenu();
    }

    onClearBDD() {
        this.utilsService.clearBDD();
    }

}
