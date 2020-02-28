import { AbstractControl } from '@angular/forms';
import { verificarCedula } from './utils';

export function CedulaValidator(control: AbstractControl) {
    if (!verificarCedula(control.value)) {
      // console.log('cedula invalida', control.value);
        //Retornar error
      return { cedulaValida: true };
    }
    // console.log('cedula valida', control.value);
    //Retornar null es validator valido
    return null;
  }