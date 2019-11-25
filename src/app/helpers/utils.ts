
import { environment } from 'src/environments/environment';
import { Observable, interval, throwError, of } from 'rxjs';
import { retryWhen, flatMap } from 'rxjs/operators';
import { checkLikePost } from './user-helper';
import { HttpErrorResponse } from '@angular/common/http';
import { ISubcategory } from '../interfaces/models';
import { CONFIG } from 'src/config/config';

declare var moment: any;
moment.locale('es');
const REGEX_URL = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;

//FUncion para verificar si una variable es un JSON
const isJSON = (str: any) => {
    try {
        return JSON.parse(str) && !!str;
    } catch (e) {
        return false;
    }
}

export const momentFormat = (stringdate: any, formatDate="LLL") => {
    if (moment(stringdate).isValid()) {
        return moment(new Date(stringdate)).format(formatDate);
    } else {
        return stringdate;
    }
}

export const formatFulldate = (stringdate: any) => {
    if (moment(stringdate).isValid()) {
        return moment(new Date(stringdate)).format('LLL');
    } else {
        return stringdate;
    }
}

export const formatDate = (stringdate: any) => {
    if (moment(stringdate).isValid()) {
        return moment(new Date(stringdate)).format('LL');
    } else {
        return stringdate;
    }
}

export const formatTime = (stringdate: any) => {
    if (moment(stringdate).isValid()) {
        return moment(new Date(stringdate)).format('LTS');
    } else {
        return stringdate;
    }
}

export const getJSON = (variable: any) => {
    if (typeof variable === 'object') {
        return variable;
    }
    if (isJSON(variable)) {
        return JSON.parse(variable);
    } else {
        return null;
    }
}


export const setHeaders = (key: any, value: any) => {
    const newHeaders = CONFIG.API_HEADERS;
    newHeaders[key] = value;
    return newHeaders;
}

const getValueKeyFromArrObj = (arr: object[], key: string) => {
    const arrFilter = arr.map(item => item[key]);
    return arrFilter;
}

//
export const setFilterKeys = (filters: object, type: string, value: any) => {
    for (const prop in filters) {
        filters[prop] = value;
    }
    return filters;
}

// Función para obtener la distancia en KM entre dos coordenadas
export const getDistanceInKm = (lat1: number,lon1: number,lat2: number,lon2: number) => {
    let R = 6371;
    let dLat = (lat2-lat1) * (Math.PI/180);
    let dLon = (lon2-lon1) * (Math.PI/180);
    let a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * (Math.PI/180)) * Math.cos(lat2 * (Math.PI/180)) *
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ;
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    let d = R * c;
    return d;
}
  
export const roundDecimal = (numero: number) => {
    return Math.round(numero * 100) / 100;
}

export const filterDataInObject = (data: any[], filter: {}) => {
    let new_data = data.filter(function (item) {
        for (var key in filter) {
            if (item[key] === undefined || item[key] != filter[key])
                return false;
        }
        return true;
    });
    return new_data;
}

//Recibe array objetos y un objeto con el valor a buscar y devuelve true/false si existe ese valor
// Ejemplo [{id: 1, name: 'lola}, {id: 2, name: 'bebe'}], {name: 'bebe}
export const searchInArrayObj = (items: any[], filter: { [key: string]: any }) => {
    let match = false;
    //Recorrer los Filtros a Aplicar
    for (const prop in filter) {
        //Recorro el arreglo y verifico si existe esa propiedad 
        // y si existe si coincide con el valor solicitado
        items.forEach((item: any) => {
            const hasOwnProperty = item.hasOwnProperty(prop);
            const propMatch = item[prop] === filter[prop];
            if (hasOwnProperty && propMatch) {
                match = true;
            }
        });
    }
    return match;
}

export const ramdomItem = (array: any[]) => {
    const valueRamdom = ramdomValue(array.length);
    const item = array[valueRamdom];
    return item;
}

export const http_retry = <T>(maxRetry: number = 5, delayMs: number = 2000) => {
    return (src: Observable<T>) => src.pipe(
        retryWhen(_ => {
            return interval(delayMs).pipe(
                flatMap(count => count == maxRetry ? throwError("Giving up") : of(count))
            )
        })
    )
}

const ramdomValue = (tamanio: number) => {
    return Math.floor(Math.random() * tamanio);
}

const imagenIsURL = (image_name: string) => {
    return REGEX_URL.test(image_name);
}

//Obtener la URL de una imagen
export const getImageURL = (image_name: string) => {
    const imgIsURL = imagenIsURL(image_name);
    if (imgIsURL) {
        return image_name;
    } else {
        return `${environment.APIBASEURL}/${CONFIG.IMAGE_ASSETS}/${image_name}`;
    }
}

export const mapImagesApi = (images: any[]) => {
    // console.log('imagesapi', images)
    return images.map((image: any) => {
        image.url = getImageURL(image.url);
        return image;
    });
}

export const mapUser = (user: any) => {
    if (user && user.avatar) {
        user.avatar = getImageURL(user.avatar);
    } else {
        user.avatar = 'assets/img/default/img_avatar.png';
    }
    return user;
}

export const manageTwoFingerDrag = (event: any) => {
    // console.warn('event map target', event);
    // console.dir('current target map', event.currentTarget);
    if (event.type === 'touchstart' && event.touches.length === 1) {
        event.currentTarget.classList.add('swiping')
    } else {
        event.currentTarget.classList.remove('swiping');
    }
}

export const MapNotification = (notification: any) => {
    if (notification && notification.user) {
        notification.user = mapUser(notification.user);
    }
    return notification;
}

//Función Obtener Backgound
export const getBackgroundApp = (image_url: string) => {
    return `linear-gradient(rgba(2, 2, 2, 0.58), rgba(2, 2, 2, 0.58)), url(${image_url})`;
}

//isType('object', variable);
export const isType = (type: any, val: any) => {
    return !!(val.constructor && val.constructor.name.toLowerCase() === type.toLowerCase());
}

export const mapEvent = (event: any) => {
    const dateFull = `${event.date} ${event.time}`;
    // event.fulldate = momentFormat(dateFull, 'll');
    event.date = formatDate(dateFull);
    event.time = formatTime(dateFull);
    event.ubication = getJSON(event.ubication);
    if (event.images && event.images.length > 0) {
        event.images = mapImagesApi(event.images);
        event.imagesArr = getValueKeyFromArrObj(event.images, 'url');
    }
    if (event.user && event.user.avatar) {
        event.user.avatar = getImageURL(event.user.avatar);
    }
    if (event.range_date) {
        event.fulldate = formatEventRangeDate(event.range_date.start_date, event.range_date.end_date);
    }
    console.log('evento retornado', event);
    return event;
}

const formatEventRangeDate = (start_date: string, end_date: string) => {
    if (start_date && end_date) {
        return `${momentFormat(start_date, 'LLL')} - ${momentFormat(end_date, 'LLL')}`
    }
    return `${momentFormat(start_date, 'LLL')}`
}

export const getRandomColor = () => {
    const avalaibleColors = ['primary', 'secondary', 'tertiary', 'success', 'light', 'medium', 'dark'];
    return ramdomItem(avalaibleColors);

}

export const mapEmergency = (emergency: any) => {
    const dateFull = `${emergency.date} ${emergency.time}`;
    emergency.fulldate = formatFulldate(dateFull);
    emergency.date = formatDate(dateFull);
    emergency.time = formatTime(dateFull);
    emergency.ubication = getJSON(emergency.ubication);
    if (emergency.images && emergency.images.length > 0) {
        emergency.images = mapImagesApi(emergency.images);
        emergency.imagesArr = getValueKeyFromArrObj(emergency.images, 'url');
    }
    return emergency;
}
export const mapReport = (report: any) => {
    report.fulldate = `${report.date} ${report.time}`;
    report.ubication = getJSON(report.ubication);
    if (report.images && report.images.length > 0) {
        report.images = mapImagesApi(report.images);
        report.imagesArr = getValueKeyFromArrObj(report.images, 'url');
    }
    return report;
}
export const mapSocialProblem = (social_problem: any) => {
    const dateFull = `${social_problem.date} ${social_problem.time}`;
    social_problem.fulldate = formatFulldate(dateFull);
    social_problem.date = formatDate(dateFull);
    social_problem.time = formatTime(dateFull);
    social_problem.ubication = getJSON(social_problem.ubication);
    if (social_problem.images && social_problem.images.length > 0) {
        social_problem.images = mapImagesApi(social_problem.images);
        social_problem.imagesArr = getValueKeyFromArrObj(social_problem.images, 'url');
    }
    if (social_problem.user && social_problem.user.avatar) {
        social_problem.user.avatar = getImageURL(social_problem.user.avatar);
    }
    return social_problem;
}

export const mapCategory = (category: ISubcategory) => {
    const avalaibleIcons = [
        'https://raw.githubusercontent.com/StalinMazaEpn/StalinResources/master/svg/bot.svg?sanitize=true',
        'https://raw.githubusercontent.com/StalinMazaEpn/StalinResources/master/svg/envelope.svg?sanitize=true',
        'https://raw.githubusercontent.com/StalinMazaEpn/StalinResources/master/svg/headset.svg?sanitize=true',
        'https://raw.githubusercontent.com/StalinMazaEpn/StalinResources/master/svg/imac.svg?sanitize=true'
    ];
    const category_icon = ramdomItem(avalaibleIcons);
    category.icon = category_icon;
    return category;
}

export const setInputFocus = (inputElement: any) => {
    const nativeEl = inputElement.nativeElement.querySelector('input');
    const inputSelection = nativeEl.selectionStart;
    nativeEl.focus();
    setTimeout(() => {
        nativeEl.setSelectionRange(inputSelection, inputSelection);
    }, 1);
}

export const getImagesPost = ($imagesArray: any[]) => {
    if ($imagesArray) {
        if ($imagesArray.length === 0) {
            return '';
        } else {
            return $imagesArray[0].url;
        }
    } else {
        return '';
    }
}