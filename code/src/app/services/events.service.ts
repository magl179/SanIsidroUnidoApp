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

    constructor() { }

    resetSocialProblemEmmiter() {
        // console.log('post service emit event');
        this.socialProblemEmitter.emit('reset-social-problems');
    }

    resetEventsEmitter() {
        // console.log('post service emit event');
        this.eventsEmitter.emit('reset-events');
    }

    resetEmergenciesEmitter() {
        this.emergenciesEmitter.emit('reset-emergencies');
    }
}