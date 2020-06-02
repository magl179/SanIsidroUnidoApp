import { Pipe, PipeTransform } from '@angular/core';
import { roundDecimal, getDistanceInKm } from 'src/app/helpers/utils';

@Pipe({
  name: 'publicServiceDistancePipe'
})
export class PublicServiceDistancePipe implements PipeTransform {

    constructor() { }

  transform(latitude: number, longitude: number, latitudeTwo: number, longitudeTwo: number): number {
    return roundDecimal(
        getDistanceInKm(
            latitude, longitude, 
            latitudeTwo, longitudeTwo));
  }

}
