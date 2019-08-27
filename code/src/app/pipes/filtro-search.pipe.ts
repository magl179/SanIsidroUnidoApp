import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filtroSearch'
})
export class FiltroSearchPipe implements PipeTransform {

    transform(
        arreglo: any,
        texto: any,
        columna: string): any[] {
        
        // console.log('Arreglo Entrante: ', arreglo);
        // console.log('Columna Entrante: ', columna);
        // console.log('Texto Entrante: ', texto);
        // console.log('arreglo 0', arreglo[0]);

        // if (arreglo[0].hasOwnProperty(columna)) {
        //     console.log('Item Columna Entrante: ', arreglo[0][columna]);
        // }

        if (texto === '' || texto === null) {
            arreglo.exists = 1;
            return arreglo;
        }

        if (!Number.isInteger(texto)) {
            texto = texto.toLowerCase();
        }
        // console.log('Arreglo Entrante: ', arreglo);
        // console.log('Columna Entrante: ', columna);
        // console.log('Texto Entrante: ', texto);
        // console.log('arreglo 0', arreglo[0]);

        let arregloFiltrado = arreglo.filter(item => {
            // console.log('item: ', item);
            // console.log('item-columna: ', item[columna].toString().toLowerCase());
            // console.log('texto: ', texto);
            // console.log('columna: ', columna);
            if (!Number.isInteger(texto)) {
                return item.hasOwnProperty(columna) && item[columna] !== null && item[columna].toString().toLowerCase().includes(texto);
            } else {
                return item.hasOwnProperty(columna) && item[columna] !== null && item[columna].includes(texto);
            }
        });
        console.log('Arreglo Filtrado', arregloFiltrado);

        if (arregloFiltrado.length === 0) {
            const elemento: any = {};
            // tslint:disable-next-line: no-string-literal
            elemento.exists = -1;
            arregloFiltrado = [elemento];
        }
        console.log('Arreglo Filtrado', arregloFiltrado);

        return arregloFiltrado;


    }

}
