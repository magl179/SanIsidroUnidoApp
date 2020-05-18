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
    
    // Función para obtener el listado de servicios publicos
    getPublicServices(): Observable<any> {
        return this.httpRequest.get(`${environment.APIBASEURL}/servicios-publicos`);
    }
    //Obtener el listado de servicios públicos por categoria
    getPublicServicesByCategory(category: string): Observable<any>{
        return this.httpRequest.get(`${environment.APIBASEURL}/servicios-publicos/categorias/${category}`)
    }
    //Obtener el detalle de un servicio público
    getPublicService(id: number): Observable<any> {
        return this.httpRequest.get(`${environment.APIBASEURL}/servicios-publicos/${id}`);
    }
    //Obtener el listado de categorias de los servicios públicos
    getPublicServiceCategories(): Observable<any> {
        return this.httpRequest.get(`${environment.APIBASEURL}/servicios-publicos/categorias`)
    }
}
