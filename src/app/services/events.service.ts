import { Injectable, EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

// const

@Injectable({
  providedIn: 'root'
})
export class EventsService {

    socialProblemEmitter = new EventEmitter();
    socialProblemLikesEmitter = new EventEmitter();
    eventsEmitter = new EventEmitter();
    eventsLikesEmitter = new EventEmitter();
    emergenciesEmitter = new EventEmitter();
    logoutAppEmitter = new EventEmitter();

    constructor() { }

    emitLogoutEvent(){
        this.logoutAppEmitter.emit({
            type: 'logout-app'
        });
    }

    resetSocialProblemLikesEmmiter(id: number, reactions = []) {
        this.socialProblemLikesEmitter.emit({
            type: 'reset-social-problems-likes',
            id,
            reactions
        });
    }

    resetEventsLikesEmitter(id: number, reactions = []) {
        this.eventsLikesEmitter.emit({
            type: 'reset-events-likes',
            id,
            reactions
        });
    }

    resetEmergenciesEmitter() {
        this.emergenciesEmitter.emit('reset-emergencies');
    }
}
