//INTERFACES RECIBIR DATOS
// Respuesta Api
export interface IRespuestaApiSIU {
    code: number;
    message: string;
    data: any[];
    errors: any[]
}
export interface IRespuestaApiSIUSingle {
    code: number;
    message: string;
    data: any;
    errors: any[]
}

export interface IRespuestaApiSIUPaginada {
    code: number;
    message: string;
    data: IApiSUIDataPaginada;
    errors: any[]
}

interface IApiSUIDataPaginada {
    current_page: number;
    data: any[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    next_page_url?: any;
    path: string;
    per_page: number;
    prev_page_url?: any;
    to: number;
    total: number;
}

// Compartir Publicaciones
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
export interface IPublicService {
    id: number;
    name: string;
    description: string;
    ubication: IUbication;
    phones?: IPhones[];
    created_at?: string;
    updated_at?: string;
}

export interface IDirective {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    avatar?: any;
    password?: any;
    state: number;
    basic_service_image?: any;
    number_phone?: any;
    position_id?: number;
    position: IPosition[];
    created_at?: string;
    updated_at?: string;
    roles?: IRole[];
}

export interface ISocialProblem {
    id: number;
    title: string;
    description: string;
    category_id: number;
    date: string;
    time: string;
    ubication: IUbication;
    user_id: number;
    likes: number;
    images?: I_ImagesApi[];
    category?: any;
    user?: any;
    details?: any;
    postLiked?: any;
    fulldate?: any;
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
    phone_id: number;
    phone_model?: string;
    description?: string;
    user_id: number;
    created_at?: string;
    updated_at?: string;
}

// export interface IEvent {
//     id: number;
//     title: string;
//     description: string;
//     category_id: number;
//     date: string;
//     time: string;
//     ubication: IUbication;
//     user_id?: number;
//     assist: boolean;
//     notassist: boolean;
//     images?: [];
//     details?: any;
//     postAssistance?: boolean;
// }

// INTERFACES ENVIAR DATOS

export interface IEmergencyReported extends IBaseReportSend {

}

export interface ISocialProblemReported extends IBaseReportSend {
    subcategory_id?: number;
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
    number
}

export interface I_ImagesApi {
    created_at: string;
    id: number;
    post_id: number;
    updated_at: string;
    url: string;
}

export interface IEvent {
    id: number;
    title: string;
    description: string;
    date: string;
    time: string;
    ubication: IUbication;
    user_id: number;
    category_id: number;
    created_at?: string;
    updated_at?: string;
    images?: I_ImagesApi[]
    details?: any;
    postAssistance?: any;
    fulldate?: string;
}

export interface ICreateDetail {
    type: string,
    user_id: number,
    post_id: number
}

//INTERFACES NO EXPORTADAS
interface Notification {
    user_id: number;
    title: string;
    description: string;
}


interface IBaseReportSend {
    title: string;
    description: string;
    user_id?: number;
    ubication: IUbication;
    description_ubication?: string;
    images?: string[]
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

export interface IUbication {
    latitude: number;
    longitude: number;
    address: string;
    description?: string;
}

interface IPhones {
    id: number;
    public_service_id: number;
    phone_number: string;
}

export interface IPhoneUser {
    phone_id: string;
    phone_model?: string;
    phone_platform?: string
    description?: string;
    user_id?: number;
}

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
    position_id?: any;
    created_at?: string;
    updated_at?: string;
    devices?: IDeviceUser[];
    social_profiles: ISocialProfile[];
    roles: IRole[];
}

export interface ISlideTutorial {
    img: string;
    title: string;
    description: string;
}

//Modelos de Filtrado
interface IFilterOptions {
    id: any;
    name: string;
}
interface IFilterFields {
    name: string;
    value: any;
    type?: string;
    options: IFilterOptions[];
}
export interface IBasicFilter {
    [key: string]: IFilterFields;
}


//Token Decodificado
export interface ITokenDecoded {
    exp: number;
    iat: number;
    sub: number;
    user: IUserDecoded;
}

export interface IUserDecoded {
    avatar: string;
    basic_service_image?: any;
    created_at: string;
    devices: IDeviceUser[];
    email: string;
    email_verified_at?: any;
    firstname: string;
    id: number;
    lastname: string;
    number_phone?: any;
    password: string;
    position_id?: any;
    roles: IRole[];
    social_profiles: ISocialProfile[];
    state: number;
    updated_at: string;
}

// interface ISocialProfileUser {
//     created_at: string;
//     id: number;
//     provider: string;
//     social_id: string;
//     updated_at?: any;
//     user_id: number;
// }

// interface Role {
//     created_at: string;
//     description: string;
//     id: number;
//     mobile_app: number;
//     name: string;
//     role_user: Roleuser;
//     slug: string;
//     updated_at: string;
// }

// interface Roleuser {
//     created_at: string;
//     role_id: number;
//     state: number;
//     updated_at: string;
//     user_id: number;
// }

// interface Device {
//     created_at: string;
//     description: string;
//     id: number;
//     phone_id: string;
//     phone_model: string;
//     updated_at: string;
//     user_id: number;
// }
