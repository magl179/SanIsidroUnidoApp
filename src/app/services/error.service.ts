import { Injectable, ErrorHandler, Injector } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { ToastController } from "@ionic/angular";
import { ToastOptions } from '@ionic/core';
import { MessagesService } from './messages.service';

@Injectable({
  providedIn: "root"
})
export class ErrorService {
  constructor(private toastCtrl: ToastController, private messageService: MessagesService) {}

  async handleError(httpError: HttpErrorResponse) {
    // Verificar que el error HTTP ocurrio en el cliente
    if (httpError.error instanceof Error) {
      console.log("Ocurrio un error en el cliente", httpError.error);
    } else {
      console.log("Ocurrio un error en el servidor, intentalo más tarde", httpError)
    }
    return;
  }

  async showHttpError(message: string, color = "dark") {
    // const toastDefault: ToastOptions = {
    //   animated: true,
    //   message,
    //   position: 'top',
    //   duration: 2000,
    //   color: "dark"
    // };
    // const toastItem = await this.toastCtrl.create(toastDefault);
    // return await toastItem.present();
    return this.messageService.showError(message);
  }

  async manageHttpError(httpError: HttpErrorResponse, defaultMessage: string){
    const online = navigator.onLine;
    if (!online) {
      // No Internet connection
      console.log("No hay conexión a Internet");
      return await this.showHttpError("Por favor activa tu conexión a internet");
    }
    if (httpError.error instanceof Error) {
      // Verificar que el error HTTP ocurrio en el cliente
      return await this.showHttpError(defaultMessage || "Ocurrio un error, intentalo más tarde");
    } else {
      //Server Error Occurs
      if (httpError.error && httpError.error.message) {
        return await this.showHttpError( httpError.error.message );
      } else {
        return await this.showHttpError("Ocurrio un error en el servidor, intentalo más tarde");
      }
    }
  }
}
