import { Injectable } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { MessagesService } from './messages.service';
import { resolveApiError } from '../helpers/utils';

@Injectable({
  providedIn: "root"
})
export class ErrorService {
  constructor(private messageService: MessagesService) { }

  async handleError(httpError: HttpErrorResponse) {
    // Verificar que el error HTTP ocurrio en el cliente
    if (httpError.error instanceof Error) {
    } else {
    }
    return;
  }

  async showHttpError(message: string, color = "dark") {
    if (message == '') {
      return;
    }
    return this.messageService.showError(message);
  }

  async manageHttpError(httpError: HttpErrorResponse, defaultMessage: string, showMessage = true) {
    //No dispones conexion
    if (!navigator.onLine) {
      return this.messageService.showInfo('No hay una conexión a internet dispònible');
    }
    //Mostrar error api
    if (httpError.error && httpError.error.name) {
      const errorName = httpError.error.name;
      switch (errorName) {
        case "Integrity constraint violation":
          return this.messageService.showError("El registro no se puede eliminar porque tiene información asociada");
        default:
          return this.messageService.showError(errorName);
      }

    }
    if (httpError.error && httpError.error.message) {
      return this.messageService.showError(httpError.error.message);
    }
    if (httpError.error && typeof httpError.error == 'string') {
      return this.messageService.showError(httpError.statusText);
    }
    if (httpError.error && typeof httpError.error === 'object') {
      const messageError = resolveApiError(httpError.error);
      if (messageError && messageError != '') {
        return this.messageService.showError(messageError);
      } else {
        return this.messageService.showError(resolveApiError(httpError.message));
      }
    }
    if (httpError instanceof HttpErrorResponse) {
      return this.messageService.showError(resolveApiError(httpError.message));
    }
    //Mostrar error general
    // if (httpError && httpError instanceof Error) {
    //     return this.showError(resolveApiError(httpError.error));
    // } else {
    //     return this.showError("Ha ocurrido un error, intentalo más tarde");
    // }
    return this.messageService.showError("Ha ocurrido un error, intentalo más tarde");
  }
}
