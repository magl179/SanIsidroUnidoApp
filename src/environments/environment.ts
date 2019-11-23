// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    apiBaseURL: 'http://localhost/github/sanisidroapi/public/api/v1',
    AUTHORIZATION_NAME: 'Authorization',
    eventsSlug: 'eventos',
    emergenciesSlug: 'emergencias',
    firebase_app_id: '729197860050',
    googleClientID: '1051963029462-mht230ntj5grq6k0ng3get34kfq3ldvu.apps.googleusercontent.com',
    home_route: 'home-list',
    headersApp: {
        'Content-Type': 'application/json'
    },
    image_assets: 'imagenes',
    mapBoxApiKey: 'pk.eyJ1Ijoic3RhbGlubWF6YWRldjk3IiwiYSI6ImNrMDQyZXY1cDExY3Mzbm1rdXJka3lpbzgifQ.jHDtbzUgiYBPshiRHwSfLQ',
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
    onesignal_id: '2ffbdcc2-223e-4527-9164-9583ea47d0b4',
    production: false,
    reportsSlug: 'reportes',
    roles_permitidos: ['morador', 'invitado', 'policia'],
    roles_permitidos_reportar: ['morador', 'policia'],
    socialProblemSlug: 'problemas_sociales',
    version: '1.0.1',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
