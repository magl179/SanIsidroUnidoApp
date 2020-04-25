import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpRequestService } from "./http-request.service";
import { map } from 'rxjs/operators';
import { mapUser } from 'src/app/helpers/utils';

@Injectable({
    providedIn: 'root'
})
export class DirectivesService {

    constructor(
        private httpRequest: HttpRequestService
    ) { }

    getDirectives(): Observable<any> {
        return this.httpRequest.get(`${environment.APIBASEURL}/directivos`).pipe(
            map((res: any) => {
            if (res && res.data) {
                res.data.forEach((directive: any) => {
                    directive = mapUser(directive);
                });
            }
            return res;
        }));
    }
}
