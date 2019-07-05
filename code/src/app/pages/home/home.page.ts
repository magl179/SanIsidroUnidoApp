import { Component, OnInit } from '@angular/core';
import { MenuManagedService } from '../../services/menu-managed.service';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

    constructor(
        private menuManagedService: MenuManagedService
    ) { }

    // ionViewDidEnter() {
    //     setTimeout(() => {
    //         this.splash = false;
    //     }, this.animationDuration);
    // }

    ngOnInit() {
        // setTimeout(() => {
        //     this.splash = false;
        //     console.log('Animation Ends');
        // }, 3500);
    //     this.menuManagedService.desactivarMenu();
    }

}
