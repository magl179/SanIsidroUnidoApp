
import { environment } from 'src/environments/environment';
import { Observable, interval, throwError, of } from 'rxjs';
import { retryWhen, flatMap } from 'rxjs/operators';
import { checkLikePost } from './user-helper';

declare var moment: any;
moment.locale('es');
const URL_PATTERN = new RegExp("^(?:(?:http(?:s)?|ftp)://)(?:\\S+(?::(?:\\S)*)?@)?(?:(?:[a-z0-9\u00a1-\uffff](?:-)*)*(?:[a-z0-9\u00a1-\uffff])+)(?:\\.(?:[a-z0-9\u00a1-\uffff](?:-)*)*(?:[a-z0-9\u00a1-\uffff])+)*(?:\\.(?:[a-z0-9\u00a1-\uffff]){2,})(?::(?:\\d){2,5})?(?:/(?:\\S)*)?$");

//FUncion para verificar si una variable es un JSON
const isJSON = (str: any) => {
    try {
        return JSON.parse(str) && !!str;
    } catch (e) {
        return false;
    }
}

export const formatFulldate = (stringdate) => {   
    let beatifulDate = null;
    if (moment(stringdate).isValid()) {
        //console.log('string full valid', stringdate)
        return moment(new Date(stringdate)).format('LLL');
    }else{
        return stringdate;
    }
}

export const formatDate = (stringdate) => {
    let beatifulDate = null;
    if (moment(stringdate).isValid()) {
        //console.log('string date valid', stringdate)
        return moment(new Date(stringdate)).format('LL');
    }else{
        return stringdate;
    }
}

export const formatTime = (stringdate) => {
    let beatifulDate = null;
    if (moment(stringdate).isValid()) {
        //console.log('string time valid', stringdate)
        return moment(new Date(stringdate)).format('LTS');
    }else{
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
    const newHeaders = environment.headersApp;
    newHeaders[key] = value;
    return newHeaders;
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

export const ramdomItem = (array: any[]) =>  {
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
    return URL_PATTERN.test(image_name);
}

 //Obtener la URL de una imagen
export const getImageURL = (image_name: string) => {
    const imgIsURL = imagenIsURL(image_name);
    if (imgIsURL) {
        return image_name;
    } else {
        return `${environment.apiBaseURL}/${environment.image_assets}/${image_name}`;
    }
}

export const mapImagesApi = (images: any[]) => {
    return images.map((image: any) => {
        image.url = getImageURL(image.url);;
        return image;
    });
}

export const mapUser = (user: any) => {
    user.avatar = getImageURL(user.avatar);
    return user;
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
    event.fulldate =  formatFulldate(dateFull) ;
    event.date =  formatDate(dateFull);
    event.time =  formatTime(dateFull);
    event.ubication = getJSON(event.ubication);
    if (event.images && event.images.length > 0) {
        event.images = mapImagesApi(event.images);
    }
    if (event.user && event.user.avatar) {
        event.user.avatar= getImageURL(event.user.avatar);
    }
    return event;
}

export const mapEmergency = (emergency: any) => {
     const dateFull = `${emergency.date} ${emergency.time}`;
    emergency.fulldate =  formatFulldate(dateFull) ;
    emergency.date =  formatDate(dateFull);
    emergency.time =  formatTime(dateFull);
    emergency.ubication = getJSON(emergency.ubication);
    if (emergency.images && emergency.images.length > 0) {
        emergency.images = mapImagesApi(emergency.images);
    }
    return emergency;
}
export const mapReport = (report: any) => {
    report.fulldate = `${report.date} ${report.time}`;
    report.ubication = getJSON(report.ubication);
    if (report.images && report.images.length > 0) {
        report.images = mapImagesApi(report.images);
    }
    return report;
}
export const mapSocialProblem = (social_problem: any) => {
    const dateFull = `${social_problem.date} ${social_problem.time}`;
    social_problem.fulldate =  formatFulldate(dateFull) ;
    social_problem.date =  formatDate(dateFull);
    social_problem.time =  formatTime(dateFull);
    social_problem.ubication = getJSON(social_problem.ubication);
    if (social_problem.images && social_problem.images.length > 0) {
        social_problem.images = mapImagesApi(social_problem.images);
    }
    if (social_problem.user && social_problem.user.avatar) {
        social_problem.user.avatar= getImageURL(social_problem.user.avatar);
    }
    return social_problem;
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