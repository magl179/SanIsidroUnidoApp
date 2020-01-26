import { Injectable, EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

// const

@Injectable({
  providedIn: 'root'
})
export class EventsService {

    socialProblemEmitter = new EventEmitter();
    eventsEmitter = new EventEmitter();
    emergenciesEmitter = new EventEmitter();
    logoutAppEmitter = new EventEmitter();

    constructor() { }

    emitLogoutEvent(){
        this.logoutAppEmitter.emit({
            type: 'logout-app'
        });
    }

    resetSocialProblemEmmiter(id: number) {
        // console.log('post service emit event');
        this.socialProblemEmitter.emit({
            type: 'reset-social-problems',
            id
        });
    }

    resetEventsEmitter(id: number) {
        // console.log('post service emit event');
        this.eventsEmitter.emit({type: 'reset-events', id});
    }

    resetEmergenciesEmitter() {
        this.emergenciesEmitter.emit('reset-emergencies');
    }
}
