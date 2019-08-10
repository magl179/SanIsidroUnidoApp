export interface PublicService {
    id: number;
    name: string;
    description: string;
    ubication: Ubication;
    phones?: Phones[];
}

interface Ubication {
    latitude: string;
    longitude: string;
    address: string;
}

interface Phones {
    id: number;
    public_service_id: number;
    phone_number: string;
}

export interface Directive {
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
    roles?: Role[];
}

interface Role {
    id: number;
    name: string;
    slug: string;
    description: string;
    created_at: string;
    updated_at: string;
    role_user?: RoleUser;
}

interface RoleUser {
    user_id: number;
    role_id: number;
    position?: string;
}
