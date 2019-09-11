//INTERFACES RECIBIR DATOS
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
    images?: [];
    category?: any;
    user?: any;
    details?: any;
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

export interface IEvent {
    id: number;
    title: string;
    description: string;
    category_id: number;
    date: string;
    time: string;
    ubication: IUbication;
    user_id?: number;
    assist: boolean;
    notassist: boolean;
    images?: [];
    details?: any;
}

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

export interface IEventDetail {
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
    details?: any;
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