import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'jsonValidate'
})
export class JsonValidatePipe implements PipeTransform {


    getJSON(variable) {
        if (typeof variable === 'object') {
            return variable;
        }
        if (this.isJSON(variable)) {
            return JSON.parse(variable);
        } else {
            return null;
        }
    }


    isJSON(str) {
        try {
            return JSON.parse(str) && !!str;
        } catch (e) {
            return false;
        }
    }


    transform(value: any, args?: any): any {
        return this.getJSON(value);
    }

}
