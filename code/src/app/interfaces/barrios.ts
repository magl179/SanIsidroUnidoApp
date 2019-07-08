export interface UbicationItem {
    latitude: number;
    longitude: number;
    title: string;
    iconColor: string;
}

export interface SimpleUbicationItem {
    latitude: number;
    longitude: number;
    title: string;
}

export interface PostUbicationItem {
    latitude: number;
    longitude: number;
    address: string;
}

export interface MenuComponente {
    icon: string;
    name: string;
    redirectTo: string;
    routeDirection: string;
    open?: boolean;
    children?: [];
}

export interface PublicServicesComponente {
    name: string;
    description: string;
    phone?: string;
    ubication: CoordinatesMap;
}

interface CoordinatesMap {
    latitude: string;
    longitude: string;
}

export interface ReverseGeocodeResponse {
    readonly place_id: string;
    readonly licence: string;
    readonly osm_type: string;
    readonly osm_id: string;
    readonly lat: string;
    readonly lon: string;
    readonly display_name: string;
    readonly boundingbox: string[];
}

export interface UserLogued {
    id: number;
    firstname?: string;
    email: string;
    lastname?: string;
    avatar?: string;
    state: string;
    basic_service_image?: string;
    cargo: string;
    password?: string;
    phone?: string;
}

export interface UserLogin {
    email: string;
    password: string;
}
