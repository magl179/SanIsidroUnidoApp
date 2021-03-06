import { AbstractControl } from '@angular/forms';
import { verificarNumeroTelefono } from './utils';

export function TelefonoValidator(control: AbstractControl) {
    if(!control.value  || control.value == ''){
      return null;
    }
    if (!verificarNumeroTelefono(control.value)) {
        //Retornar error
      return { telefonoValido: true };
    }
    //Retornar null es validator valido
    return null;
  }