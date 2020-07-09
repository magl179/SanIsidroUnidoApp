import { Injectable, EventEmitter, OnDestroy } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EventsService implements OnDestroy{

    socialProblemEmitter = new EventEmitter();
    socialProblemLikesEmitter = new EventEmitter();
    eventsEmitter = new EventEmitter();
    eventsLikesEmitter = new EventEmitter();
    emergenciesEmitter = new EventEmitter();
    logoutAppEmitter = new EventEmitter();
    logoutDevice = new EventEmitter();

    constructor() { 
        this.logoutDevice = new EventEmitter();
    }

    ngOnDestroy(){
        this.logoutDevice.complete();
    }

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
