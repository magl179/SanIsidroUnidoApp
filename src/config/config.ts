import { IMAPLAYERS } from './config.model';

interface ICONFIG {
    ALLOWED_ROLES_SIGN_IN: string[];
    ALLOWED_ROLES_REPORT: string[];
    API_HEADERS: {};
    AUTHORIZATION_NAME: string;
    EMERGENCIES_SLUG: string;
    PUBLIC_SERVICE_SLUG: string;
    EVENTS_SLUG: string;
    HOME_ROUTE: string;
    IMAGE_ASSETS: string;
    MAPLAYERS: IMAPLAYERS;
    VERSION: string;
    REPORTS_SLUG: string;
    SOCIAL_PROBLEMS_SLUG: string;
    SHOW_BEATIFUL_ROUTES?: boolean;
    MESSAGE_APP_INFO: string;
    MESSAGE_APP_URL: string;
    EVENT_BUTTON_MESSAGE: string;
    USE_FILE_URL: boolean;
  }

export const CONFIG: ICONFIG = {
    ALLOWED_ROLES_SIGN_IN: ['morador', 'invitado', 'policia'],
    API_HEADERS: { 'content-type': 'aplication/json'},
    SHOW_BEATIFUL_ROUTES: false,
    ALLOWED_ROLES_REPORT: ['morador', 'policia'],
    AUTHORIZATION_NAME: 'Authorization',
    EMERGENCIES_SLUG: 'emergencia',
    EVENTS_SLUG: 'evento',
    HOME_ROUTE: 'home-list',    
    IMAGE_ASSETS: 'imagenes',
    PUBLIC_SERVICE_SLUG: 'servicio-publico',
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
    REPORTS_SLUG: 'informe',
    SOCIAL_PROBLEMS_SLUG: 'problema',
    VERSION: '1.0.4',
    MESSAGE_APP_INFO: 'Por San Isidro Unido con ❤',
    MESSAGE_APP_URL: 'https://www.facebook.com/stalinmaza97',
    EVENT_BUTTON_MESSAGE: 'Asistir',
    USE_FILE_URL: true
}

