import { ICONFIG } from './config.model';

export const CONFIG: ICONFIG = {
    ALLOWED_ROLES_SIGN_IN: ['morador', 'invitado', 'policia'],
    API_HEADERS: { 'content-type': 'aplication/json'},
    SHOW_BEATIFUL_ROUTES: false,
    ALLOWED_ROLES_REPORT: ['morador', 'policia'],
    AUTHORIZATION_NAME: 'Authorization',
    EMERGENCIES_SLUG: 'emergencias',
    EVENTS_SLUG: 'eventos',
    HOME_ROUTE: 'home-list',    
    IMAGE_ASSETS: 'imagenes',
    MAPLAYERS: {
        GOOGLE: {
            URL: "https://mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}",
            ATRIBUTION: '&copy; <a target=_blank" href="https://www.google.com/intl/es-419_ec/help/terms_maps/">Google Maps</a>'
        },
        OPENSTREETMAP: {
            URL: "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            ATRIBUTION: '&copy; <a target=_blank" href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }
    },
    REPORTS_SLUG: 'reportes',
    SOCIAL_PROBLEMS_SLUG: 'problemas_sociales',
    VERSION: '1.0.1',
    MESSAGE_APP_INFO: 'Por San Isidro Unido con ❤',
    MESSAGE_APP_URL: 'https://www.facebook.com/stalinmaza97'
}

