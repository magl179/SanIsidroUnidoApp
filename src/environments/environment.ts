import { IENVIRONMENT } from 'src/config/config.model';


// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment: IENVIRONMENT = {
    APIBASEURL: 'http://localhost/github/sanisidroapi/public/api/v1',
    FIREBASE_APP_ID: '729197860050',
    GOOGLE_CLIENT_ID: '1051963029462-mht230ntj5grq6k0ng3get34kfq3ldvu.apps.googleusercontent.com',
    MAPBOX_APIKEY: 'pk.eyJ1Ijoic3RhbGlubWF6YWRldjk3IiwiYSI6ImNrMDQyZXY1cDExY3Mzbm1rdXJka3lpbzgifQ.jHDtbzUgiYBPshiRHwSfLQ',
    ONESIGNAL_ID: '2ffbdcc2-223e-4527-9164-9583ea47d0b4',
    production: false
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
