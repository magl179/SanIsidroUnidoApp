import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NavigationExtras, Router, Event, NavigationStart, NavigationEnd } from '@angular/router';
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
        console.log('on init route', console.log(this.router.url));
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
                console.warn("route:", event.url);
            }
        )
    ;
    }

}
