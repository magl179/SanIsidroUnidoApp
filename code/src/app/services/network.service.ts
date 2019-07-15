import { Injectable } from '@angular/core';
import { Observable, fromEvent, merge } from 'rxjs';
import { mapTo } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ConnectionService {

    private connectionMonitor: Observable<boolean>;

    constructor() {
            const offline$ = fromEvent(window, 'offline').pipe(mapTo(false));
            const online$ = fromEvent(window, 'online').pipe(mapTo(true));
            this.connectionMonitor = merge(
                offline$, online$
            );
    }

    monitor(): Observable<boolean> {
        return this.connectionMonitor;
    }
}
