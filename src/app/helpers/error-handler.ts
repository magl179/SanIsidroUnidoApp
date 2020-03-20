
import { ErrorHandler, Injectable, Injector} from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { UtilsService } from 'src/app/services/utils.service';

export class ErrorsHandler implements ErrorHandler {
  constructor(
    private utilsService: UtilsService,
  ) {}

  handleError(error: Error | HttpErrorResponse) {
    
    if (error instanceof HttpErrorResponse) {      
    // Server error happened      
      if (!navigator.onLine) {
        // No Internet connection
        return this.utilsService.showToast({message: 'No hay una conexión a internet'});
      }
      // Http Error
      // Show notification to the user
      //return notificationService.notify(`${error.status} - ${error.message}`);
      console.log('Ocurrio un error en el cliente', error);
      return this.utilsService.showToast({message: 'Ocurrio un error, por favor intentalo más tarde'});
    } else {
      // Client Error Happend
      // Send the error to the server and then
      // redirect the user to the page with all the info
      console.log('Ocurrio un error en el servidor', error);     
      return this.utilsService.showToast({message: 'Ocurrio un error en el servidor'});
    }
  }
}

