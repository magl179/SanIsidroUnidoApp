import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { NavController } from '@ionic/angular';
import { tap, catchError, map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

    constructor(
        private authService: AuthService,
        private navCtrl: NavController,
    ) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const request = req.clone();
        // console.log('Request', request);withCredentials': 'true'
        // console.log('Angular Interceptor', request);
        return next.handle(request).pipe(
            map(data => {
                // console.log('response success', data);
                return data;
            }),
            catchError(
                (err) => {
                    // console.log('response unsuccess', err);
                    if (err.status === 401) {
                        this.authService.logout();
                    }
                    return throwError(err);
                }
            )
        );
    }
}
