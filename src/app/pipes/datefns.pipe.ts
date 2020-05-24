import { Pipe, PipeTransform } from '@angular/core';

import { formatDistanceToNow, parseISO, formatRelative, format as dateFormat} from 'date-fns'
import { es } from 'date-fns/locale'

@Pipe({
  name: 'datefns_pipe'
})
export class DateFnsPipe implements PipeTransform {

    transform(value: Date | number | string, format: string): any {
        if(typeof value == 'string'){
            value = parseISO(value);
        }
        if(format == 'fromNow'){
            return `hace ${formatDistanceToNow(value, { locale: es})}`;
        }
        if(format == 'calendar'){
            formatRelative(value, new Date(), { locale: es});
        }
        return dateFormat(value, format, { locale: es});
    }
}
