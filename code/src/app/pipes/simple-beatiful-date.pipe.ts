import { Pipe, PipeTransform } from '@angular/core';
declare var moment: any;

@Pipe({
  name: 'simpleBeatifulDate'
})
export class SimpleBeatifulDatePipe implements PipeTransform {

    transform(value: any, args?: any): any {
        let simpleBeatifulDate = null;
        moment.locale('es');
        if (moment(value).isValid()) {
            // console.log('Valid Date');
            const requestDate = moment(new Date(value));
            simpleBeatifulDate = requestDate.format('LLL');
        } else {
            // console.log('Invalid Date', value);
        }
        return simpleBeatifulDate;
        // moment().format('MMMM Do YYYY, h:mm:ss a');
  }

}
