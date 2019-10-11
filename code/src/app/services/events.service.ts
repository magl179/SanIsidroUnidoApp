import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

// const

@Injectable({
  providedIn: 'root'
})
export class EventsService {

    events_app = new BehaviorSubject({
        type: 'none'
    });

    constructor() { }
    

    getEventsApp() {
        return this.events_app.asObservable();
    }

    setEvent(name: string) {
        this.events_app.next({
            type: name
        });
        // setTimeout(() => {

        // })
    }
}
