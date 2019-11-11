// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    AUTHORIZATION_NAME: 'Authorization',
    googleClientID: '1051963029462-mht230ntj5grq6k0ng3get34kfq3ldvu.apps.googleusercontent.com',
    onesignal_id: '2ffbdcc2-223e-4527-9164-9583ea47d0b4',
    firebase_app_id: '729197860050',
    apiBaseURL: 'http://192.168.1.7/github/sanisidroapi/public/api/v1',
    socialProblemSlug: 'problemas_sociales',
    mapBoxApiKey: 'pk.eyJ1Ijoic3RhbGlubWF6YWRldjk3IiwiYSI6ImNrMDQyZXY1cDExY3Mzbm1rdXJka3lpbzgifQ.jHDtbzUgiYBPshiRHwSfLQ',
    eventsSlug: 'eventos',
    emergenciesSlug: 'emergencias',
    reportsSlug: 'reportes',
    image_assets: 'imagenes',
    roles_permitidos: ['morador', 'invitado', 'policia'],
    roles_permitidos_reportar: ['morador', 'policia'],
    mapLayers: {
        google: {
            url: "https://mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}",
            attribution: '&copy; <a target=_blank" href="https://www.google.com/intl/es-419_ec/help/terms_maps/">Google Maps</a>'
        },
        openstreetmap: {
            url: "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            attribution: '&copy; <a target=_blank" href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }
    },
    headersApp: {
        'Content-Type': 'application/json'
    }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
