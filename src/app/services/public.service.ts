import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpRequestService } from "src/app/services/http-request.service";
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PublicService {

    constructor(
        private httpRequest: HttpRequestService
    ) { }
    
    // Función para obtener el listado de servicios publicos registrados
    getPublicServices(): Observable<any> {
        return this.httpRequest.get(`${environment.apiBaseURL}/servicios-publicos`);
    }

    getPublicServicesByCategory(category: string): Observable<any>{
        return this.httpRequest.get(`${environment.apiBaseURL}/servicios-publicos/categoria/${category}`)
    }

    getPublicService(id: number): Observable<any> {
        return this.httpRequest.get(`${environment.apiBaseURL}/servicios-publicos/${id}`);
    }

    getPublicServiceCategories(): Observable<any> {
        return this.httpRequest.get(`${environment.apiBaseURL}/servicios-publicos/categorias`)
    }
}
