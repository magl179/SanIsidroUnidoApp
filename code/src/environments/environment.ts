// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    googleClientID: '1051963029462-mht230ntj5grq6k0ng3get34kfq3ldvu.apps.googleusercontent.com',
    onesignal_id : '2ffbdcc2-223e-4527-9164-9583ea47d0b4',
    firebase_app_id: '729197860050',
    apiBaseURL: 'http://192.168.1.6/github/SanIsidroWeb/public/api/v1',
    socialProblemSlug: 'social_problems' ,
    categories: [
        { name: 'Problemas Sociales', slug: 'social_problems' },
        { name: 'Emergencias', slug: 'emergencies' },
        { name: 'Eventos', slug: 'events' }
    ],
    subcategoriesSocialProblems: [
        { name: 'Protección Animal', slug: 'animal_protection' },
        { name: 'Seguridad', slug: 'security' },
        { name: 'Areás Verdes', slug: 'green_areas' },
        { name: 'Transporte & Tránsito', slug: 'transport_transit' }
    ],
    image_assets: 'imagenes'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
