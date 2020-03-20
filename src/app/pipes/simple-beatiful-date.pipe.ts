import { Pipe, PipeTransform } from '@angular/core';
declare var moment: any;

@Pipe({
  name: 'simpleBeatifulDate'
})
export class SimpleBeatifulDatePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    let simpleBeatifulDate = null;
    moment.locale('es');
    let requestDate;
    if (moment(value).isValid()) {
      requestDate = moment(new Date(value));
    } else {
      requestDate = moment(new Date());
    }
    simpleBeatifulDate = requestDate.format('LLL');
    return simpleBeatifulDate;
    // moment().format('MMMM Do YYYY, h:mm:ss a');
  }

}
