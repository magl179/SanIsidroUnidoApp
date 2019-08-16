// MENU

export interface IMenuComponent {
    icon: string;
    name: string;
    redirectTo: string;
    routeDirection: string;
    open?: boolean;
    children?: [];
}
// PUBLIC SERVICES

export interface IPublicServicesComponente {
    name: string;
    description: string;
    phone?: string;
    ubication: ISimpleCoordinates;
}

// USER

export interface IUserLogued {
    id: number;
    firstname?: string;
    lastname?: string;
    email: string;
    password?: string;
    token_id?: string;
    provider?: string;
    state: string;
    avatar?: string;
    basic_service_image?: string;
    cargo: string;
    phone?: string;
}

export interface IUserLogin {
    email: string;
    password: string;
}

// CREATE POSTS

export interface IEmergencyPost {
    title: string;
    description: string;
    images: [];
    localization: IPostUbicationItem;
}

export interface ISocialProblemPost {
    title: string;
    description: string;
    images: [];
    localization: IPostUbicationItem;
}

export interface IPostUbicationItem {
    latitude: number;
    longitude: number;
    address: string;
}

// LOCALIZATION
export interface IUbicationItem {
    id: number;
    latitude: number;
    longitude: number;
    title: string;
    description?: string;
    iconColor?: string;
}

export interface ISimpleCoordinates {
    latitude: number;
    longitude: number;
}

export interface ISimpleUbicationItem {
    latitude: number;
    longitude: number;
    title: string;
}

export interface IReverseGeocodeResponse {
    readonly place_id: string;
    readonly licence: string;
    readonly osm_type: string;
    readonly osm_id: string;
    readonly lat: string;
    readonly lon: string;
    readonly display_name: string;
    readonly boundingbox: string[];
}

export interface IMarkers {
    color: string;
    iconName: string;
    iconURL: string;
    shadow: string;
}

// READ POSTS

export interface ISocialProblem {
    id: number;
    title: string;
    description: string;
    category_id: number;
    date: string;
    time: string;
    ubication: IPostUbicationItem;
    user_id: number;
    likes: number;
    images?: [];
    category?: any;
    user?: any;
    details?: any;
}

export interface IEvent {
    id: number;
    title: string;
    description: string;
    category_id: number;
    date: string;
    time: string;
    ubication: IPostUbicationItem;
    user_id?: number;
    assist: boolean;
    notassist: boolean;
    images?: [];
    details?: any;
}

// Compartir Publicaciones
export interface IPostShare {
    title: string;
    description: string;
    image?: string;
    url?: string;
}

