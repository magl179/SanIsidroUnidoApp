
import { environment } from 'src/environments/environment';
import { Observable, interval, throwError, of } from 'rxjs';
import { retryWhen, flatMap } from 'rxjs/operators';
import { ISubcategory } from 'src/app/interfaces/models';
import { CONFIG } from 'src/config/config';

declare var moment: any;
moment.locale('es');
const REGEX_URL = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;

export const GEOLOCATION_ERRORS = {
    'errors.location.unsupportedBrowser': 'Browser does not support location services',
    'errors.location.permissionDenied': 'You have rejected access to your location',
    'errors.location.positionUnavailable': 'Unable to determine your location',
    'errors.location.timeout': 'Service timeout has been reached'
};

export const getCurrentDate = () => moment(new Date()).format("YYYY-MM-DD HH:mm:ss");

//Funcion para verificar si una variable es un JSON
const isJSON = (str: any) => {
    try {
        return JSON.parse(str) && !!str;
    } catch (e) {
        return false;
    }
}

export const momentFormat = (stringdate: any, formatDate = "LLL") => {
    if (!stringdate) {
        return '';
    }
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

export const setFilterKeys = (filters: object, type: string, value: any) => {
    for (const prop in filters) {
        filters[prop] = value;
    }
    return filters;
}

// Función para obtener la distancia en KM entre dos coordenadas
export const getDistanceInKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    let R = 6371;
    let dLat = (lat2 - lat1) * (Math.PI / 180);
    let dLon = (lon2 - lon1) * (Math.PI / 180);
    let a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
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
    return images.map((image: any) => {
        return image.url_link;
    });
}

export const mapUser = (user: any) => {
    return user;
}

export const manageTwoFingerDrag = (event: any) => {
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

export const isType = (type: any, val: any) => {
    return !!(val.constructor && val.constructor.name.toLowerCase() === type.toLowerCase());
}

export const mapEvent = (event: any) => {
    const dateFull = `${event.date} ${event.time}`;
    event.date = formatDate(dateFull);
    event.time = formatTime(dateFull);
    event.ubication = getJSON(event.ubication);
    if (event.resources && event.resources.length > 0) {
        event.images = mapImagesApi(event.resources);
        event.imagesArr = getValueKeyFromArrObj(event.resources, 'url');
    }
    const range_date = (event.additional_data && event.additional_data.event && event.additional_data.event.range_date) ? event.additional_data.event.range_date : null;
    if (range_date) {
        event.fulldate = formatEventRangeDate(range_date.start_date, range_date.end_date);
        event.initial_date = momentFormat(range_date.start_date, 'LLL')
        event.end_date = momentFormat(range_date.end_date, 'LLL')
        event.range_short_date = formatRangeDate(range_date.start_date, range_date.end_date);
        event.range_short_time = formatRangeTime(range_date.start_time, range_date.end_time);
    }

    if (range_date && range_date.start_date && range_date.end_date) {
        event.hasRangeDate = true;
    } else {
        event.hasRangeDate = false;
    }

    const fecha_creacion = (event.created_at) ? event.created_at : moment(new Date()).add(-1, 'days');
    event.fecha_creacion = fechaFull(fecha_creacion);

    const fecha_actualizacion = (event.updated_at) ? event.updated_at : moment(new Date()).add(-1, 'days');
    event.fecha_actualizacion = fechaFull(fecha_actualizacion);
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

export const getIosDateParsed = (date: any) => {
    const parsed = Date.parse(date);
    if (!isNaN(parsed)) {
        return parsed;
    }
    return Date.parse(date.replace(/-/g, '/').replace(/[a-z]+/gi, ' '));
}


export const mapEmergency = (emergency: any) => {
    const dateFull = `${emergency.date} ${emergency.time}`;
    emergency.fulldate = formatFulldate(dateFull);
    emergency.date = formatDate(dateFull);
    emergency.time = formatTime(dateFull);
    emergency.ubication = getJSON(emergency.ubication);
    if (emergency.resources && emergency.resources.length > 0) {
        emergency.images = mapImagesApi(emergency.resources);
        emergency.imagesArr = getValueKeyFromArrObj(emergency.resources, 'url_link');
    } else {
        emergency.imagesArr = [];
    }
    const fecha_creacion = (emergency.created_at) ? emergency.created_at : moment(new Date()).add(-1, 'days');
    emergency.fecha_creacion = fechaFull(fecha_creacion);

    const fecha_actualizacion = (emergency.updated_at) ? emergency.updated_at : moment(new Date()).add(-1, 'days');
    emergency.fecha_actualizacion = fechaFull(fecha_actualizacion);

    return emergency;
}
export const mapReport = (report: any) => {
    report.fulldate = `${report.date} ${report.time}`;
    report.ubication = getJSON(report.ubication);
    if (report.resources && report.resources.length > 0) {
        const imagesResources = report.resources.filter(resource => resource.type === 'image');
        const documentsResources = report.resources.filter(resource => resource.type === 'document');
        report.images = imagesResources;
        report.documents = documentsResources;
        report.imagesArr = getValueKeyFromArrObj(imagesResources, 'url_link');
        report.documentsArr = getValueKeyFromArrObj(documentsResources, 'url_link');
    } else {
        report.images = [];
        report.documents = [];
        report.imagesArr = [];
        report.documentsArr = [];
    }

    const fecha_creacion = (report.created_at) ? fechaFull(report.created_at) : fechaFull(new Date());
    report.fecha_creacion = fecha_creacion;

    const fecha_actualizacion = (report.updated_at) ? report.updated_at : moment(new Date()).add(-1, 'days');
    report.fecha_actualizacion = fechaFull(fecha_actualizacion);

    return report;
}

const fechaFull = (date: string | Date) => {
    return moment(date).format('LLLL');
}

export const mapSocialProblem = (social_problem: any) => {
    const dateFull = `${social_problem.date} ${social_problem.time}`;
    social_problem.fulldate = formatFulldate(dateFull);
    social_problem.date = formatDate(dateFull);
    social_problem.time = formatTime(dateFull);
    social_problem.ubication = getJSON(social_problem.ubication);
    if (social_problem.resources && social_problem.resources.length > 0) {
        social_problem.images = mapImagesApi(social_problem.resources);
        social_problem.imagesArr = getValueKeyFromArrObj(social_problem.resources, 'url_link');
    } else {
        social_problem.imagesArr = [];
    }
    const fecha_creacion = (social_problem.created_at) ? social_problem.created_at : moment(new Date()).add(-1, 'days');
    social_problem.fecha_creacion = fechaFull(fecha_creacion);

    const fecha_actualizacion = (social_problem.updated_at) ? social_problem.updated_at : moment(new Date()).add(-1, 'days');
    social_problem.fecha_actualizacion = fechaFull(fecha_actualizacion);

    return social_problem;
}

export const getFirstPostImage = (post: any) => {
    if (!post.imagesArr) { return null; }
    if (post.imagesArr.length == 0) {
        return null
    } else {
        return post.imagesArr[0];
    }
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

export const randomInteger = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//Obtener la fecha formateada con MomentJS
export const formatAppBeatifulDate = (stringDate: string) => {
    let beatifulDate = null;
    let lastDate;
    if (moment(stringDate).isValid()) {
        //Fecha Parametro
        lastDate = moment(new Date(stringDate));
    } else {
        lastDate = moment(new Date());
    }

    // Fecha Pasada, Fecha Actual
    const currentDate = moment(new Date());
    //Diferencia entre Fechas
    const diffDays = currentDate.diff(lastDate, 'days');
    // Formatear Fecha
    if (diffDays <= 8) {
        beatifulDate = lastDate.fromNow();
    } else if (currentDate.year() === lastDate.year()) {
        beatifulDate = lastDate.format('D MMMM');
    } else {
        beatifulDate = lastDate.format('LL');
    }

    return beatifulDate;
}

//Obtener la fecha formateada con MomentJS
export const formatRangeDate = (initial_date: string, end_date: string) => {
    let initialBeatifulDate = null;
    let endBeatifulDate = null;
    if (moment(initial_date).isValid() && moment(end_date).isValid()) {
        // Fecha Pasada, Fecha Actual
        const initialDate = moment(new Date(initial_date));
        const endDate = moment(new Date(end_date));
        // Formatear Fecha
        if (initialDate.year() === endDate.year()) {
            initialBeatifulDate = initialDate.format('D MMMM');
            endBeatifulDate = endDate.format('D MMMM');
            return `${initialBeatifulDate} - ${endBeatifulDate} del ${endDate.year()}`;
        } else {
            initialBeatifulDate = initialDate.format('LL');
            endBeatifulDate = endDate.format('LL');
            return `${initialBeatifulDate} - ${endBeatifulDate}`;
        }
    } else {
        return `${initial_date} - ${end_date}`;
    }
}

export const formatRangeTime = (initial_date: string, end_date: string) => {
    let initialBeatifulDate = null;
    let endBeatifulDate = null;
    if (moment(initial_date).isValid() && moment(end_date).isValid()) {
        // Fecha Pasada, Fecha Actual
        const initialTime = moment(new Date(initial_date)).format('HH:mm');
        const endTime = moment(new Date(end_date)).format('HH:mm');
        // Formatear Fecha
        if (initialTime == endTime) {
            return `${initialTime}`;
        } else {
            return `${initialTime} - ${endTime}`;
        }
    } else {
        return `${initial_date} - ${end_date}`;
    }
}

export const getPostState = (state: number) => {
    switch (state) {
        case 1:
          return 'Atendida'
        case 0:
          return 'Rechazada';
        case 2:
          return 'Pendiente';
        default:
         return 'Pendiente de Atención';
      }
}

export const verificarCedula = (validarCedula: string): boolean => {
    let aux = 0,
        par = 0,
        impar = 0,
        verifi;
    for (let i = 0; i < 9; i += 2) {
        aux = 2 * Number(validarCedula[i]);
        if (aux > 9) {
            aux -= 9;
        }
        par += aux;
    }
    for (let i = 1; i < 9; i += 2) {
        impar += Number(validarCedula[i]);
    }
    aux = par + impar;
    if (aux % 10 !== 0) {
        verifi = 10 - (aux % 10);
    } else {
        verifi = 0;
    }
    if (verifi === Number(validarCedula[9])) {
        return true;
    } else {
        return false;
    }
}

export const verificarNumeroTelefono = (numero_verificar) => {
    if (/(^(09)[0-9]{8})+$|(^(02)[0-9]{7})+$/.test(numero_verificar)) {
        return true;
    } else {
        return false;
    }
}

export const cortarTextoConPuntos = (texto: string, limite: number = 30) => {
    const puntosSuspensivos = "...";
    if (texto.length > limite) {
        texto = texto.substring(0, limite) + puntosSuspensivos;
    }
    return texto;
}