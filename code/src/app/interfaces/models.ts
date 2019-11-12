//INTERFACES RECIBIR DATOS
interface IBasicResponse {
    code: number;
    message: string;
    status: string;
    errors?: any[];
}
export interface IRespuestaApiSIU extends IBasicResponse{
    data: any[];
}
export interface IRespuestaApiSIUSingle extends IBasicResponse{
    data: any;
}

export interface IRespuestaApiSIUPaginada extends IBasicResponse{
    current_page: number;
    data: any[];
    first_page_url: string;
    from: number;
    next_page_url: string;
    path: string;
    per_page: number;
    prev_page_url?: any;
    to: number;
}
//Interfaz Publicaciones
export interface IPost {
    id: any;
    title: string;
    description: string;
    date: string;
    time: string;
    is_attended: number;
    user_id: number;
    category_id: number;
    subcategory_id?: any;
    created_at?: any;
    updated_at?: any;
    ubication?: IUbication;
    images?: I_ImagesApi[];
    details?: any[],
    category?: any;
    subcategory?: ISubcategory;
    user?: any;
    category_name?: string;
    subcategory_name?: string;
}

export interface ISocialProblem extends IPost {
    likes: number;
    postLiked?: any;
    fulldate?: any;
}
export interface IEvent extends IPost {
    postAssistance?: any;
    fulldate?: string;
}
//Imagenes
export interface I_ImagesApi {
    created_at: string;
    id: number;
    post_id: number;
    updated_at: string;
    url: string;
}
// Servicios Publicos
export interface IPublicService {
    id: number;
    name: string;
    description: string;
    ubication: IUbication;
    phones?: IPhones[];
    created_at?: string;
    updated_at?: string;
}
//Telefonos Servicio Publico
interface IPhones {
    id: number;
    public_service_id: number;
    phone_number: string;
}

// Interfaces Extras
export interface IPostShare {
    title: string;
    description: string;
    image?: string;
    url?: string;
}
export interface IMenuServices {
    title: string;
    icon: string;
    url: string;
    valid_roles: string[];
}
export interface IHomeOptions {
    title: string;
    icon: string;
    url: string;
    valid_roles: string[];
};

export interface IMenuOptions{
    authenticated: IMenuComponent[];
    not_authenticated: IMenuComponent[];
}

interface IMenuComponent {
    icon: string;
    name: string;
    redirectTo: string;
    routeDirection: string;
    children: any[];
    open?: any;
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

export interface ISimpleCoordinates {
    latitude: number;
    longitude: number;
}

interface IFilterOptions {
    id: any;
    name: string;
}

export interface IBasicFilter {
    [key: string]: IFilterFields;
}
interface IFilterFields {
    name: string;
    value: any;
    type?: string;
    options: IFilterOptions[];
}

export interface INotiPostOpen {
    subcategory?: string;
    category: "string";
    id: number;
}

export interface ISlideTutorial {
    img: string;
    title: string;
    description: string;
}


//Interfaz Usuario
export interface IUser {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    email_verified_at?: any;
    avatar?: string;
    password?: any;
    state: number;
    basic_service_image?: any;
    number_phone?: any;
    phone?: any;
    position_id?: any;
    created_at?: string;
    updated_at?: string;
    devices?: IDeviceUser[];
    social_profiles?: ISocialProfile[];
    roles?: IRole[];
}
export interface IDirective extends IUser {
    position: IPosition[];
}
interface IPosition {
    id: number;
    name: string;
    slug: string;
    allocation: string;
    created_at?: string;
    updated_at?: string;
}
interface IRole {
    id: number;
    name: string;
    slug: string;
    description: string;
    created_at?: string;
    updated_at?: string;
    role_user?: IRoleUser;
}

interface IRoleUser {
    user_id: number;
    role_id: number;
    position?: string;
}

//Token Decodificado
export interface ITokenDecoded {
    exp: number;
    iat: number;
    sub: number;
    user: IUser;
}

export interface ISocialProfile {
    id: Number;
    user_id: number;
    social_id: string;
    provider: string;
    created_at?: string;
    updated_at?: string;
}

export interface IDeviceUser {
    id: Number;
    phone_id: string;
    user_id: number;
    phone_model?: string;
    phone_platform?: string;
    description?: string;
    created_at?: string;
    updated_at?: string;
}

export interface ILoginUser {
    email: string;
    provider: string;
    social_id?: string;
    password?: string;
    getToken?: boolean;
}

export interface IRegisterUser {
    firstname: string;
    lastname: string;
    email: string;
    provider: string;
    social_id?: string;
    password?: string;
}

export interface IEditProfile {
    firstname: string;
    lastname: string;
    email: string;
    number: string
}
// INTERFACES ENVIAR DATOS
interface IBaseReportSend {
    title: string;
    description: string;
    user_id?: number;
    ubication: IUbication;
    description_ubication?: string;
    images?: string[]
}

export interface IEmergencyReported extends IBaseReportSend {
}

export interface ISocialProblemReported extends IBaseReportSend {
    subcategory_id?: number;
}

export interface ICreateDetail {
    type: string,
    user_id: number,
    post_id: number
}

//Categoria
export interface ICategory{
    id: number;
    name: string;
    slug: string;
    description: string;
    created_at?: any;
    updated_at?: any;
}
//SubCategoria
export interface ISubcategory {
    id: number;
    name: string;
    slug: string;
    description: string;
    category_id: number;
    created_at?: any;
    updated_at?: any;
    icon?: string;
}
//Ubicacion
export interface IUbication {
    latitude: number;
    longitude: number;
    altitude?: number;
    address: string;
    description?: string;
}