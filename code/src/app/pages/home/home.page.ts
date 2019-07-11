import { Component, OnInit } from '@angular/core';
import { UtilsService } from '../../services/utils.service';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

    constructor(
        private utilsService: UtilsService
    ) { }

    ngOnInit() {
        this.utilsService.disabledMenu();
    }

    onClearBDD() {
        this.utilsService.clearBDD();
    }

}
