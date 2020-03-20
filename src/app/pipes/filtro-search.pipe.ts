import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filtroSearch'
})
export class FiltroSearchPipe implements PipeTransform {

    transform(
        arreglo: any,
        texto: any,
        columna: string): any[] {
        if (texto === '' || texto === null) {
            return arreglo;
        }

        if (!Number.isInteger(texto)) {
            texto = texto.toLowerCase();
        }

        let arregloFiltrado = arreglo.filter(item => {
            if (!Number.isInteger(texto)) {
                return item.hasOwnProperty(columna) && item[columna] !== null && item[columna] === texto;
            } else {
                return item.hasOwnProperty(columna) && item[columna] !== null && (!Number.isInteger(item[columna])) ? item[columna] === texto: parseInt(item[columna]) === texto;
            }
        });
        if (arregloFiltrado.length === 0) {
            arregloFiltrado = [];
        }
        return arregloFiltrado;


    }

}
