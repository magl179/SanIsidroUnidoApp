import { IENVIRONMENT } from 'src/config/config.model';

export const environment: IENVIRONMENT = {
  production: true,
  GOOGLE_CLIENT_ID: '1051963029462-mht230ntj5grq6k0ng3get34kfq3ldvu.apps.googleusercontent.com',
  ONESIGNAL_ID : '2ffbdcc2-223e-4527-9164-9583ea47d0b4',
  FIREBASE_APP_ID: '522134390512',
  APIBASEURL: 'http://192.168.1.5:8000/api/v1',
  //APIBASEURL: 'https://sanisidrosmdev.herokuapp.com/api/v1',
  BASEURL: 'https://sanisidrosmdev.herokuapp.com',
  MAPBOX_APIKEY: 'pk.eyJ1Ijoic3RhbGlubWF6YWRldjk3IiwiYSI6ImNrMDQyZXY1cDExY3Mzbm1rdXJka3lpbzgifQ.jHDtbzUgiYBPshiRHwSfLQ'
};

//Crear archivo environment.prod.ts para el archivo de producción
//Crear archivo environment.ts para el archivo de desarrollo
//Usar las mismas keys, los valores pueden diferir dependiendo del entorno


// Este archivo puede ser reemplazado durante la construcción usando la opción `fileReplacements` con el comando `ng build --prod` en el archivo angular.json

/*
 * Para facil debugging en el modo de desarrollo se puede importar el archivo "zone-error" para ignorar problemas del stack y deberia
 * ser comentado al construir el modo de producción
 */
// import 'zone.js/dist/zone-error';  // Incluida con el CLI de Angular
