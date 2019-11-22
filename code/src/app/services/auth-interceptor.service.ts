import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { tap, catchError, map, delay, mergeMap, retryWhen } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

    private statusCodeAvoid = [401];


    constructor(
        private authService: AuthService
    ) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const request = req.clone();
        return next.handle(request).pipe(
            this.http_retry(2),
            map(data => {
                // console.log('response success', data);
                return data;
            }),
            catchError(
                (err: HttpErrorResponse) => {
                    // console.log('response unsuccess', err);
                    if (err.error instanceof Error) {
                        console.log("Ocurrio un error en la petición del cliente");
                    } else {
                        console.log("Ocurrio un error en el servidor");
                    }
                    if (!environment.production) {
                        console.log('Http Error: ', err);
                    }
                    if (err.status === 401) {
                        this.authService.logout();
                    }
                    return throwError(err);
                }
            )
        );
    }

    http_retry<T>(maxRetry: number = 2, delayMs: number = 2000) {
        return (src: Observable<T>) => src.pipe(
            retryWhen(errors => {
                let retryCount = 0;
                return errors
                    .pipe(
                        delay((delayMs)),
                        mergeMap(error => {
                            const statusError = error.status;
                            const includesCodeAvoid = this.statusCodeAvoid.includes(statusError);
                            //console.log('retry count', retryCount);
                            if (retryCount >= maxRetry || includesCodeAvoid) {
                                return throwError(error);
                            }
                            retryCount++;
                            return of(error);
                        }),
                        tap(() => console.log('retrying...'))
                    );
            })
        )
    }
}
