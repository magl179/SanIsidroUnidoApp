import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filtroSearch'
})
export class FiltroSearchPipe implements PipeTransform {

    transform(
        arreglo: any,
        texto: any,
        columna: string): any[] {
        console.log('Arreglo Entrante: ', arreglo);
        if (texto === '' || texto === null) {
            arreglo.exists = 1;
            return arreglo;
        }

        texto = texto.toLowerCase();


        let arregloFiltrado = arreglo.filter(item => {
            console.log('item: ', item);
            console.log('item-columna: ', item[columna].toString().toLowerCase());
            console.log('texto: ', texto);
            console.log('columna: ', columna);
            return item[columna].toString().toLowerCase().includes(texto);
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
