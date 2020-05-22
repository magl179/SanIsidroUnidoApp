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

@Injectable({
    providedIn: "root"
})
export class AuthInterceptorService implements HttpInterceptor {

    private statusCodeAvoid = [401];
    private numIntentos = 1;

    constructor(
        private authService: AuthService,
        private errorService: ErrorService
    ) { }

    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        //Clonar la Request
        const request = req.clone();
        //Manejar la Request
        return next.handle(request).pipe(
            this.http_retry(this.numIntentos),
            map(data => {
                return data;
            }),
            catchError((httpError: HttpErrorResponse) => {
                of(async () => await this.errorService.handleError(httpError));
                if (httpError.status === 401) {
                    this.authService.logout();
                }

                return throwError(httpError);
            })
        );
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
