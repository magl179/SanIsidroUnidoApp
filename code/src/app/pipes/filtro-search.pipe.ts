import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filtroSearch'
})
export class FiltroSearchPipe implements PipeTransform {

    transform(
        arreglo: any,
        texto: any,
        columna: string): any[] {

        if (texto === '') {
            return arreglo;
        }

        texto = texto.toLowerCase();


        let arregloFiltrado = arreglo.filter(item => {
            return item[columna].toLowerCase().includes(texto);
        });



        if (arregloFiltrado.length === 0) {
            const elemento = {};
            elemento[columna] = 'No hay elementos que coincidan con la busqueda';
            arregloFiltrado = [elemento];
        }
        console.log(arregloFiltrado);

        return arregloFiltrado;


    }

}
