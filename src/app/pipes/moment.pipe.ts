import { Pipe, PipeTransform } from '@angular/core';

declare var moment: any;
moment.locale('es');

@Pipe({
  name: 'moment_pipe'
})
export class MomentPipe implements PipeTransform {

    transform(value: Date | string, dateFormat: string): any {
        if(dateFormat == 'fromNow'){
            return `hace ${moment(value).fromNow(true)}`;
        }
        if(dateFormat == 'calendar'){
            return moment(value).calendar();
        }
        return moment(value).format(dateFormat);
    }
}
