import { Injectable } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { MessagesService } from './messages.service';
import { resolveApiError } from '../helpers/utils';

@Injectable({
  providedIn: "root"
})
export class ErrorService {
  constructor(private messageService: MessagesService) {}

  async handleError(httpError: HttpErrorResponse) {
    // Verificar que el error HTTP ocurrio en el cliente
    if (httpError.error instanceof Error) {
    } else {
    }
    return;
  }

  async showHttpError(message: string, color = "dark") {
    if(message == ''){
      return;
    }
    return this.messageService.showError(message);
  }

  async manageHttpError(httpError: HttpErrorResponse, defaultMessage: string, showMessage=true){
    const online = navigator.onLine;
    if(!showMessage){
      return;
    }
    if(!online) {
      // No Internet connection
      return await this.showHttpError("Por favor activa tu conexión a internet");
    }
    if(httpError.error && httpError.error.errors){
        return this.messageService.showError(resolveApiError( httpError.error.errors));
    }
    
    if (httpError && httpError.error instanceof Error) {
      // Verificar que el error HTTP ocurrio en el cliente
      return await this.showHttpError(defaultMessage || "Ha ocurrido un error, intentalo más tarde");
    } else {
      if (httpError && httpError.error && httpError.error.message) {
        return await this.showHttpError( httpError.error.message );
      } else {
        return await this.showHttpError("Ha ocurrido un error, intentalo más tarde");
      }
    }
  }
}
