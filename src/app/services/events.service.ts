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
        console.log('post service emit social problem', id);
        this.socialProblemLikesEmitter.emit({
            type: 'reset-social-problems-likes',
            id,
            reactions
        });
    }

    resetEventsLikesEmitter(id: number, reactions = []) {
        console.log('post service emit event', id);
        this.eventsLikesEmitter.emit({
            type: 'reset-events-likes',
            id,
            reactions
        });
    }


    // resetEventsEmitter(id: number) {
    //     // console.log('post service emit event');
    //     this.eventsEmitter.emit({type: 'reset-events', id});
    // }

    resetEmergenciesEmitter() {
        this.emergenciesEmitter.emit('reset-emergencies');
    }
}
