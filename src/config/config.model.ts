export interface IENVIRONMENT {
  APIBASEURL: string;
  FIREBASE_APP_ID: string;
  GOOGLE_CLIENT_ID: string;
  MAPBOX_APIKEY: string;
  ONESIGNAL_ID: string;
  production: boolean;
}

export interface ICONFIG {
  ALLOWED_ROLES_SIGN_IN: string[];
  ALLOWED_ROLES_REPORT: string[];
  API_HEADERS: {};
  AUTHORIZATION_NAME: string;
  EMERGENCIES_SLUG: string;
  EVENTS_SLUG: string;
  HOME_ROUTE: string;
  IMAGE_ASSETS: string;
  MAPLAYERS: IMAPLAYERS;
  REPORTS_SLUG: string;
  SOCIAL_PROBLEMS_SLUG: string;
  VERSION: string;
  SHOW_BEATIFUL_ROUTES?: boolean;
}

export interface IMAPLAYERS {
  GOOGLE: IGOOGLE;
  OPENSTREETMAP: IGOOGLE;
}

export interface IGOOGLE {
  URL: string;
  ATRIBUTION: string;
}
