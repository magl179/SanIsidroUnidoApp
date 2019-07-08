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

    // ionViewDidEnter() {
    //     setTimeout(() => {
    //         this.splash = false;
    //     }, this.animationDuration);
    // }

    ngOnInit() {
        this.utilsService.desactivarMenu();
        // setTimeout(() => {
        //     this.splash = false;
        //     console.log('Animation Ends');
        // }, 3500);
    }

}
