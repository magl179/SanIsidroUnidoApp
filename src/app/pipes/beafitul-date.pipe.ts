import { Pipe, PipeTransform } from '@angular/core';
declare var moment: any;

@Pipe({
  name: 'beafitulDate'
})
export class BeafitulDatePipe implements PipeTransform {

    transform(value: any, args?: any): any {
        let beatifulDate = null;
        moment.locale('es');
        if (moment(value).isValid()) {
            // console.log('Valid Date');
            const currentDate = moment(new Date());
            const lastDate = moment(new Date(value));
            // Fecha Pasada, Fecha Actual
            const diffDays = Math.abs(currentDate.diff(lastDate, 'days'));
            // console.log('Diferencia entre dias: ', diffDays);
            if (diffDays <= 8) {
                // console.log('Fecha Anterior', lastDate.fromNow());
                beatifulDate = lastDate.fromNow();
            } else if (currentDate.year() === lastDate.year()) {
                // console.log('Fecha Anterior: ', lastDate.format('D MMMM'));
                beatifulDate = lastDate.format('D MMMM');

            } else {
                // console.log('Fecha Anterior', lastDate.format('LL'));
                beatifulDate = lastDate.format('LL');
            }
        } else {
            console.log('Invalid Date', value);
        }
        return beatifulDate;
  }

}

