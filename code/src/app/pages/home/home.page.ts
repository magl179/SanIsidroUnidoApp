import { Component, OnInit } from '@angular/core';
import { UtilsService } from '../../services/utils.service';
import { DataAppService } from '../../services/data-app.service';
import { AuthService } from '../../services/auth.service';

export interface MenuServices {
    title: string;
    icon: string;
    url: string;
    valid_roles: string[];
}

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

    userAuthenticated = {};
    servicesList: MenuServices[] = [];

    constructor(
        private utilsService: UtilsService,
        private dataService: DataAppService,
        private authService: AuthService
    ) { }

    async ngOnInit() {
        await this.authService.getUserSubject().subscribe(authState => {
            this.userAuthenticated = authState;
        });
        await this.dataService.getHomeOptions().subscribe((data) => {
            this.servicesList = data;
        });
        await this.utilsService.enableMenu();
    }

    onClearBDD() {
        this.utilsService.clearBDD();
    }

}
