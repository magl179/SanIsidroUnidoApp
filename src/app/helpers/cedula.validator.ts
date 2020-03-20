import { AbstractControl } from '@angular/forms';
import { verificarCedula } from './utils';

export function CedulaValidator(control: AbstractControl) {
    if (!verificarCedula(control.value)) {
        //Retornar error
      return { cedulaValida: true };
    }
    //Retornar null es validator valido
    return null;
  }