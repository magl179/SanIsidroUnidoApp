//INTERFACES RECIBIR DATOS
interface IBasicResponse {
    code: number;
    message: string;
    status: string;
    errors?: any[];
}
export interface IRespuestaApiSIU extends IBasicResponse {
    data: any[];
}
export interface IRespuestaApiSIUSingle extends IBasicResponse {
    data: any;
}

export interface IRespuestaApiSIUPaginada extends IBasicResponse {
    current_page: number;
    data: any[];
    first_page_url: string;
    from: number;
    next_page_url: string;
    path: string;
    per_page: number;
    prev_page_url?: string;
    to: number;
}
interface IRangeDate {
    end_date: string;
    end_time: string;
    start_date: string;
    start_time: string;
}

interface IAdditionalData {
    log_event?: ILogEvent;
    log_emergency?: ILogEmergency;
    log_post: ILogPost;
}

interface ILogEvent {
    responsable: string;
}
interface ILogEmergency {
    policia: string;
}
interface ILogPost {
    moderador: string;
}

export interface IReaction {
    id: number;
    url: string;
    type: string;
    post_id: number;
    created_at: string;
    updated_at: string;
    url_link: string;
}

export interface IResource {
    id: number;
  url: string;
  type: string;
  post_id: number;
  created_at: string;
  updated_at: string;
  url_link: string;
}

//Interfaz Publicaciones
export interface IPost {
    id: number;
    title: string;
    description: string;
    state: number;
    date: string;
    time: string;
    ubication?: IUbication;
    additional_data: IAdditionalData;
    is_attended: number;
    user_id: number;
    created_at?: string;
    updated_at?: string;
    category_id: number;
    subcategory_id?: number;
    resources: IResource[];
    category?: ICategory;
    user: IUser;
    subcategory?: ISubcategory;
    reactions?: IReaction[],
    images?: I_ImagesApi[];
    imagesArr: string[];
}

export interface IEmergency extends IPost {
}

export interface IReport extends IPost {
    fecha_creacion: string;
}

export interface ISocialProblem extends IPost {
    likes: number;
    postLiked?: boolean;
    fulldate?: string;
    fecha_creacion?: string;
}
export interface IEvent extends IPost {
    postAssistance?: boolean;
    fulldate?: string;
    responsible?: any;
    end_date?: string;
    initial_date?: string;
    additional_data: any;
    hasRangeDate?: boolean;
    fecha_creacion?: string;
    range_short_date?: string;
    range_short_time?: string;
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
    subcategory?: ISubcategory;
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
    isFunction: boolean;
    valid_roles: string[];
};

export interface IMenuOptions {
    authenticated: IMenuComponent[];
    not_authenticated: IMenuComponent[];
}

interface IMenuComponent {
    icon: string;
    name: string;
    redirectTo: string;
    routeDirection: string;
    children: any[];
    open?: boolean;
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

export interface INotificationApi {
    id: string;
    type: string;
    notifiable_type: string;
    notifiable_id: number;
    data: INotiList;
    read_at?: string;
    created_at: string;
    updated_at: string;
}

export interface INotiList {
    title: string;
    message: string;
    notification_user: INotificationUser;
    post: INotificationPost;
}

export interface INotificationUser extends IUser {
    pivot?: IRole[];
}

export interface INotificationPost extends IPost {
}

export interface INotiPostOpen {
    subcategory?: string;
    category: string;
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
    first_name: string;
    last_name: string;
    email: string;
    email_verified_at?: string;
    avatar?: string;
    password?: string;
    state: number;
    basic_service_image?: string;
    number_phone?: string;
    position_id?: number;
    created_at?: string;
    updated_at?: string;
    devices?: IDeviceUser[];
    social_profiles?: ISocialProfile[];
    roles?: IRole[];
    avatar_link?: string;
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
    first_name: string;
    last_name: string;
    email: string;
    provider: string;
    social_id?: string;
    password?: string;
}

export interface IEditProfile {
    first_name: string;
    last_name: string;
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
export interface ICategory {
    id: number;
    name: string;
    slug: string;
    description: string;
    created_at?: string;
    updated_at?: string;
}
//SubCategoria
export interface ISubcategory {
    id: number;
    name: string;
    slug: string;
    description: string;
    category_id: number;
    created_at?: string;
    updated_at?: string;
    icon?: string;
    image?: string;
    image_link?: string;
}
//Ubicacion
export interface IUbication {
    latitude: number;
    longitude: number;
    altitude?: number;
    address: string;
    description?: string;
}