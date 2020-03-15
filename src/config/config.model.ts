export interface IENVIRONMENT {
  APIBASEURL: string;
  BASEURL: string;
  FIREBASE_APP_ID: string;
  GOOGLE_CLIENT_ID: string;
  MAPBOX_APIKEY: string;
  ONESIGNAL_ID: string;
  production: boolean;
}

export interface IMAPLAYERS {
  GOOGLE: IGOOGLE;
  OPENSTREETMAP: IGOOGLE;
}

export interface IGOOGLE {
  URL: string;
  ATRIBUTION: string;
}
