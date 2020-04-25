import { Injectable } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { MessagesService } from './messages.service';

@Injectable({
  providedIn: "root"
})
export class ErrorService {
  constructor(private messageService: MessagesService) {}

  async handleError(httpError: HttpErrorResponse) {
    // Verificar que el error HTTP ocurrio en el cliente
    if (httpError.error instanceof Error) {
      // console.error("Ocurrio un error en el cliente", httpError.error);
    } else {
      // console.error("Ocurrio un error en el servidor, intentalo más tarde", httpError)
    }
    return;
  }

  async showHttpError(message: string, color = "dark") {
    return this.messageService.showError(message);
  }

  async manageHttpError(httpError: HttpErrorResponse, defaultMessage: string, showMessage=true){
    const online = navigator.onLine;
    console.error('SIU LOG ERROR', httpError);
    if(!showMessage){
      return;
    }
    if(!online) {
      // No Internet connection
      return await this.showHttpError("Por favor activa tu conexión a internet");
    }
    if (httpError && httpError.error instanceof Error) {
      // Verificar que el error HTTP ocurrio en el cliente
      return await this.showHttpError(defaultMessage || "Ocurrio un error, intentalo más tarde");
    } else {
      //Server Error Occurs
      if (httpError && httpError.error && httpError.error.message) {
        return await this.showHttpError( httpError.error.message );
      } else {
        return await this.showHttpError("Ocurrio un error en el servidor, intentalo más tarde");
      }
    }
  }
}
