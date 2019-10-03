import { environment } from 'src/environments/environment';

const URL_PATTERN = new RegExp("^(?:(?:http(?:s)?|ftp)://)(?:\\S+(?::(?:\\S)*)?@)?(?:(?:[a-z0-9\u00a1-\uffff](?:-)*)*(?:[a-z0-9\u00a1-\uffff])+)(?:\\.(?:[a-z0-9\u00a1-\uffff](?:-)*)*(?:[a-z0-9\u00a1-\uffff])+)*(?:\\.(?:[a-z0-9\u00a1-\uffff]){2,})(?::(?:\\d){2,5})?(?:/(?:\\S)*)?$");

//FUncion para verificar si una variable es un JSON
const isJSON = (str: any) => {
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


export const setHeaders = (key: any, value: any) => {
    const newHeaders = environment.headersApp;
    newHeaders[key] = value;
    console.log('new headers returned', newHeaders);
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

const ramdomValue = (tamanio: number) => {
    return Math.floor(Math.random() * tamanio);
}

const imagenIsURL = (image_name: string) => {
    return URL_PATTERN.test(image_name);
}

 //Obtener la URL de una imagen
export const getImageURL = (image_name: string) => {
    const imgIsURL = imagenIsURL(image_name);
    // console.log('is image/ url extern', imgIsURL);
    // console.log('is image url extern', image_name);
    if (imgIsURL) {
        return image_name;
    } else {
        return `${environment.apiBaseURL}/${environment.image_assets}/${image_name}`;
    }
}

export const mapImagesApi = (images: any[]) => {
    return images.map((image: any) => {
        image.url = getImageURL(image.url);
        // console.log('image returned', image.url);
        return image;
    });
}

//Función Obtener Backgound
export const getBackgroundApp = (image_url: string) => {
    return `linear-gradient(rgba(2, 2, 2, 0.58), rgba(2, 2, 2, 0.58)), url(${image_url})`;
}

