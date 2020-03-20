import { Pipe, PipeTransform } from '@angular/core';
declare var moment: any;

@Pipe({
  name: 'beafitulDate'
})
export class BeafitulDatePipe implements PipeTransform {

    transform(value: any, args?: any): any {
        let beatifulDate = null;
        moment.locale('es');
        let lastDate;
        if (moment(value).isValid()) {
            lastDate  = moment(new Date(value));
        } else {
            lastDate = moment(new Date());
        }
        const currentDate = moment(new Date());
        // Fecha Pasada, Fecha Actual
        const diffDays = Math.abs(currentDate.diff(lastDate, 'days'));
        if (diffDays <= 8) {
            beatifulDate = lastDate.fromNow();
        } else if (currentDate.year() === lastDate.year()) {
            beatifulDate = lastDate.format('D MMMM');
        } else {
            beatifulDate = lastDate.format('LL');
        }
        return beatifulDate;
  }

}

