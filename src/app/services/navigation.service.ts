import { Injectable, OnInit } from '@angular/core';
import { Router, Event, NavigationEnd } from '@angular/router';
import { NavController } from '@ionic/angular';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NavigationService implements OnInit {

    constructor(
        private navCtrl: NavController,
        private router: Router
    ) { }

    ngOnInit() {
    }

    keepHistoryTracking() {
        this.router.events
        .pipe(
            filter(
                ( event: Event ) => {
                    return( event instanceof NavigationEnd  );
                }
            )
        )
        .subscribe(
            ( event: NavigationEnd ) => {
                // console.warn("route:", event.url);
            }
        )
    ;
    }

}
