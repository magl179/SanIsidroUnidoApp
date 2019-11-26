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
  tap,
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

  constructor(
    private authService: AuthService,
    private errorService: ErrorService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const request = req.clone();
    return next.handle(request).pipe(
      this.http_retry(2),
      map(data => {
        // console.log('response success', data);
        return data;
      }),
      catchError((httpError: HttpErrorResponse) => {

        of(async() => await this.errorService.handleError(httpError));

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
            mergeMap(error => {
              const statusError = error.status;
              const includesCodeAvoid = this.statusCodeAvoid.includes(
                statusError
              );
              //console.log('retry count', retryCount);
              if (retryCount >= maxRetry || includesCodeAvoid) {
                return throwError(error);
              }
              retryCount++;
              return of(error);
            }),
            tap(() => console.log("retrying..."))
          );
        })
      );
  }
}
