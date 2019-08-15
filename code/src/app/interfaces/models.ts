//INTERFACES RECIBIR DATOS
export interface IPublicService {
    id: number;
    name: string;
    description: string;
    ubication: IUbication;
    phones?: IPhones[];
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
    created_at: string;
    updated_at: string;
    roles?: IRole[];
}

// INTERFACES ENVIAR DATOS

export interface IEmergencyReported extends IBaseReportSend {
}

export interface ISocialProblemReported extends IBaseReportSend {
}

export interface ILoginUser {
    email: string;
    provider: string;
    social_id?: string;
    password?: string;
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

export interface IEventDetail{
    id: number;
    title: string;
    description: string;
    date: string;
    time: string;
    ubication: IUbication;
    user_id: number;
    category_id: number;
    created_at: string;
    updated_at: string;
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
    user_id: number;
    ubication: IUbication;
}


interface IRole {
    id: number;
    name: string;
    slug: string;
    description: string;
    created_at: string;
    updated_at: string;
    role_user?: IRoleUser;
}

interface IRoleUser {
    user_id: number;
    role_id: number;
    position?: string;
}

interface IUbication {
    latitude: number;
    longitude: number;
    address: string;
}

interface IPhones {
    id: number;
    public_service_id: number;
    phone_number: string;
}
