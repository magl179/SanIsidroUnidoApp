
import { environment } from 'src/environments/environment';
import { Observable, interval, throwError, of } from 'rxjs';
import { retryWhen, flatMap } from 'rxjs/operators';
import { ISubcategory, IResource, IRole } from 'src/app/interfaces/models';
import { CONFIG } from 'src/config/config';
import { es } from 'date-fns/locale'
import { parseISO, format as dateFormat } from 'date-fns';
import { ITokenDecoded } from '../interfaces/models';

const REGEX_URL = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;

export const GEOLOCATION_ERRORS = {
    'errors.location.unsupportedBrowser': 'Browser does not support location services',
    'errors.location.permissionDenied': 'You have rejected access to your location',
    'errors.location.positionUnavailable': 'Unable to determine your location',
    'errors.location.timeout': 'Service timeout has been reached'
};

export const getCurrentDate = () => dateFormat(new Date(), 'yyyy-MM-dd HH:mm:s');

//Funcion para verificar si una variable es un JSON
const isJSON = (str: string) => {
    try {
        return JSON.parse(str) && !!str;
    } catch (e) {
        return false;
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


export const setHeaders = (key: string, value: any) => {
    const newHeaders = CONFIG.API_HEADERS;
    newHeaders[key] = value;
    return newHeaders;
}

const getValueKeyFromArrObj = (arr: object[], key: string) => {
    const arrFilter = arr.map(item => item[key]);
    return arrFilter;
}

export const setFilterKeys = (filters: object, value: any) => {
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

export const chechUserCanRequestMembership = (token_decoded: ITokenDecoded) => {
    const memberships = (token_decoded && token_decoded.user && token_decoded.user.memberships) ? token_decoded.user.memberships.filter(membership => membership.status_attendance == "aprobado") : [];
    const canMakeMembership = (memberships && memberships.length == 0) ? true : false;
    return canMakeMembership;
}

export const isRolActive = (roles: IRole[]) => {
    const role = roles.filter(rol => rol.pivot && rol.pivot.state == 1);
    if (role && role.length > 0) { return true }
    return false;
};

//Recibe array objetos y un objeto con el valor a buscar y devuelve true/false si existe ese valor
export const searchInArrayObj = (items: any[], filter: { [key: string]: any }) => {
    let match = false;
    //Recorrer los Filtros a Aplicar
    for (const prop in filter) {
        //Recorro el arreglo y verifico si existe esa propiedad 
        // y si existe si coincide con el valor solicitado
        items.forEach((item) => {
            const hasOwnProperty = item.hasOwnProperty(prop);
            const propMatch = item[prop] === filter[prop];
            if (hasOwnProperty && propMatch) {
                match = true;
            }
        });
    }
    return match;
}

export const ramdomItem = (array = []) => {
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

export const imagenIsURL = (image_name: string) => {
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

export const mapImagesApi = (images: IResource[]) => {
    return images.map((image: IResource) => {
        return image.url;
    });
}

export const mapUser = (user) => {
    return user;
}

export const manageTwoFingerDrag = (event: any) => {
    if (event.type === 'touchstart' && event.touches.length === 1) {
        event.currentTarget.classList.add('swiping')
    } else {
        event.currentTarget.classList.remove('swiping');
    }
}

export const MapNotification = (notification) => {
    if (notification && notification.data && notification.data.notification_user) {
        notification.data.notification_user = mapUser(notification.data.notification_user);
    }
    if(notification && notification.data && notification.data.neighbor){
        notification.data.notification_user = mapUser(notification.data.neighbor);
    }
    notification.data.action = 'logout';
    return notification;
}

//Función Obtener Backgound
export const getBackgroundApp = (image_url: string) => {
    return `linear-gradient(rgba(2, 2, 2, 0.58), rgba(2, 2, 2, 0.58)), url(${image_url})`;
}

export const isType = (type: string, val: any) => {
    return !!(val.constructor && val.constructor.name.toLowerCase() === type.toLowerCase());
}

export const mapEvent = (event) => {
    event.ubication = getJSON(event.ubication);
    if (event.resources && event.resources.length > 0) {
        event.images = mapImagesApi(event.resources);
        event.imagesArr = getValueKeyFromArrObj(event.resources, 'url_link');
    }
    const range_date = (event.additional_data && event.additional_data.range_date) ? event.additional_data.range_date : null;
    if (range_date) {
        const my_start_date = (range_date.start_date) ? formatString(range_date.start_date, 'dd MMM yyyy') : '';
        const my_end_date = (range_date.end_date) ? formatString(range_date.end_date, 'dd MMM yyyy') : '';
        const my_start_time = (range_date.start_date && range_date.start_time) ? formatString(`${range_date.start_date} ${range_date.start_time}`, 'HH:mm') : '';
        const my_end_time = (range_date.end_date && range_date.end_time) ? formatString(`${range_date.end_date} ${range_date.end_time}`, 'HH:mm') : '';

        event.range_short_date = (my_start_date && my_end_date) ? `${my_start_date} al ${my_end_date}` : `${my_start_date}`;
        event.range_short_time = (my_start_time && my_end_time) ? `${my_start_time} al ${my_end_time}` : `${my_start_time}`;
    }
    return event;
}

export const getRandomColor = () => {
    const avalaibleColors = ['primary', 'secondary', 'tertiary', 'success', 'light', 'medium', 'dark'];
    return ramdomItem(avalaibleColors);
}

export const getIosDateParsed = (date: string) => {
    const parsed = Date.parse(date);
    if (!isNaN(parsed)) {
        return parsed;
    }
    return Date.parse(date.replace(/-/g, '/').replace(/[a-z]+/gi, ' '));
}


export const mapEmergency = (emergency) => {
    emergency.ubication = getJSON(emergency.ubication);
    if (emergency.resources && emergency.resources.length > 0) {
        emergency.images = mapImagesApi(emergency.resources);
        emergency.imagesArr = getValueKeyFromArrObj(emergency.resources, 'url_link');
    } else {
        emergency.imagesArr = [];
    }

    emergency.status_attendance = (emergency.additional_data) ? emergency.additional_data.status_attendance : '';
    return emergency;
}

export const cleanEmpty = (obj, defaults = [undefined, null, NaN, '']) => {
    if (!defaults.length) return obj
    if (defaults.includes(obj)) return

    if (Array.isArray(obj))
        return obj
            .map(v => v && typeof v === 'object' ? cleanEmpty(v, defaults) : v)
            .filter(v => !defaults.includes(v))

    return Object.entries(obj).length
        ? Object.entries(obj)
            .map(([k, v]) => ([k, v && typeof v === 'object' ? cleanEmpty(v, defaults) : v]))
            .reduce((a, [k, v]) => (defaults.includes(v) ? a : { ...a, [k]: v }), {})
        : obj
}

export const mapReport = (report: any) => {
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

    return report;
}

export const mapSocialProblem = (social_problem: any) => {
    social_problem.ubication = getJSON(social_problem.ubication);
    if (social_problem.resources && social_problem.resources.length > 0) {
        social_problem.images = mapImagesApi(social_problem.resources);
        social_problem.imagesArr = getValueKeyFromArrObj(social_problem.resources, 'url_link');
    } else {
        social_problem.imagesArr = [];
    }

    social_problem.status_attendance = (social_problem.additional_data) ? social_problem.additional_data.status_attendance : ''

    return social_problem;
}

export const getFirstPostImage = (imagesArr: string[]) => {
    if (!imagesArr) { return null; }
    if (imagesArr.length == 0) {
        return null
    } else {
        return imagesArr[0];
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

export const getImagesPost = ($imagesArray: IResource[]) => {
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

export const formatString = (value_date: string, format = "HH:mm") => {
    return dateFormat(parseISO(value_date), format, { locale: es })
}

export const formatRange = (initial_date: string, end_date: string, format = "HH:mm"): string => {
    // Fecha Pasada, Fecha Actual
    initial_date = initial_date || new Date().toString();
    end_date = end_date || new Date().toString();
    const initialTime = dateFormat(parseISO(initial_date), format, { locale: es });
    const endTime = dateFormat(parseISO(end_date), format, { locale: es });
    // Formatear Fecha
    if (initialTime == endTime) {
        return `${initialTime}`;
    } else {
        return `${initialTime} - ${endTime}`;
    }
}

export const formatTimeRange = (initial_date: string, end_date: string, format = "HH:mm"): string => {
    // Fecha Pasada, Fecha Actual
    initial_date = initial_date || new Date().toString();
    end_date = end_date || new Date().toString();
    const initialTime = dateFormat(parseISO(initial_date), format, { locale: es });
    const endTime = dateFormat(parseISO(end_date), format, { locale: es });
    // Formatear Fecha
    if (initialTime == endTime) {
        return `${initialTime}`;
    } else {
        return `${initialTime} - ${endTime}`;
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

export const resolveApiError = (error: any): string => {
    if (typeof error !== 'string') {
        const properties = Object.getOwnPropertyNames(error);
        for (var i = 0; i < properties.length; i++) {
            const value = error[properties[i]];
            if (typeof value === 'boolean') {
                return ''
            } else {
                return resolveApiError(value);
            }
         }
    } else {
        return error;
    }
}