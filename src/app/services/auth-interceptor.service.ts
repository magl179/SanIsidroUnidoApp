import { Injectable } from "@angular/core";
import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpErrorResponse
} from "@angular/common/http";
import { Observable, of, throwError } from "rxjs";
import { AuthService } from "./auth.service";
import {
    catchError,
    map,
    delay,
    mergeMap,
    retryWhen
} from "rxjs/operators";

import { ErrorService } from "src/app/services/error.service";
import { NetworkService } from './network.service';
import { EventsService } from './events.service';

@Injectable({
    providedIn: "root"
})
export class AuthInterceptorService implements HttpInterceptor {

    private statusCodeAvoid = [401, 403];
    private numIntentos = 1;

    constructor(
        private authService: AuthService,
        private networkService: NetworkService,
        private errorService: ErrorService,
        private eventsService: EventsService
    ) { }

    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {

        //Clonar la Request
        const request = req.clone();

        const isOnline = this.networkService.getNetworkValue();
        // Verificar la conexión de Internet
        if (!isOnline) {
            // Enviar una respuesta de error si no hay internet disponible
            return Observable.throw(new HttpErrorResponse({ error: 'No hay una conexión a internet disponible' }));

        } else {
            //Manejar la Request
            return next.handle(request).pipe(
                this.http_retry(this.numIntentos),
                map(data => {
                    return data;
                }),
                catchError((httpError: HttpErrorResponse) => {
                    of(async () => await this.errorService.handleError(httpError));
                    if (this.statusCodeAvoid.includes(
                        httpError.status 
                    )) {
                        this.authService.logout();
                    }

                    return throwError(httpError);
                })
            );
        }



    }

    http_retry<T>(maxRetry: number = 2, delayMs: number = 2000) {
        return (src: Observable<T>) =>
            src.pipe(
                retryWhen(errors => {
                    let retryCount = 0;
                    return errors.pipe(
                        delay(delayMs),
                        mergeMap(request_error => {
                            const statusError = request_error.status;
                            const includesCodeAvoid = this.statusCodeAvoid.includes(
                                statusError
                            );
                            if (retryCount >= maxRetry || includesCodeAvoid) {
                                return throwError(request_error);
                            }
                            retryCount++;
                            return of(request_error);
                        })
                    );
                })
            );
    }




}
