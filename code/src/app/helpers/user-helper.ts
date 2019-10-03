import { Storage } from '@ionic/storage';
import { getImageURL } from './utils';
import { environment } from 'src/environments/environment';


// Function obtener los detalles de un usuario
export const getUsersFromDetails = ($details: any) => {
    return $details.map((detail: any) => detail.user_id);
}

// Funcion para verificar si un usuario ha dado like o asistencia en un detalle de un post
export const checkUserInDetails = (user_id: number, users_id: number[]) => {
    return users_id.includes(user_id);
}

//Funcion verifica like en un posts
export const checkLikePost = (details: any, user_authenticated: any) => {
    if (details && details.length > 0) {
        const likes_user = getUsersFromDetails(details);
        const user_made_like = checkUserInDetails(user_authenticated.id, likes_user);
        return user_made_like;
    }
    else {
        return false;
    }
}

// export const mapUser = async(token_decoded: any) => {
//     // let user = user_auth;

//     let new_token_decoded: any = token_decoded;
//     if (new_token_decoded && new_token_decoded.user) {
//         // console.log('get url image token decoded');
//         new_token_decoded.user.avatar = getImageURL(new_token_decoded.user.avatar);
//         const roles = new_token_decoded.user.roles.map((role: any) => role.slug);
//         const rol = roles.find((rol: any) => {
//             // console.log('rol', rol);
//             // console.log('roles permitidos', environment.roles_permitidos);
//             return environment.roles_permitidos.includes(rol);
//         });
//         if (rol) {
//             new_token_decoded.user.rolename = rol;
//         }
//     }
//     return new_token_decoded;
// }

//Obtener los Roles Usuario
export const getUserRoles = (sessionAuth: any) => {
    return (sessionAuth && sessionAuth.user) ? sessionAuth.user.roles.map((role: any) => role.slug) : [];
}

// Verificar si un usuario tiene unos roles en especifico
export const hasRoles = async (sessionAuth, allowedRoles: string[]) => {
    let hasRole = false;
    // if (this.isAuthenticated()) {
    // if (!this.authUser.value) {
    //     await this.getUserLocalStorage();
    // }
    if (sessionAuth && sessionAuth.user) {
        let userRoles = await getUserRoles(sessionAuth);
        for (const oneRole of allowedRoles) {
            if (userRoles.includes(oneRole.toLowerCase())) {
                hasRole = true;
            }
        }
    }
    // }
    return hasRole;
}


//Verificar si el usuario esta activo
export const isActive = async (authUser) => {
    // if (this.isAuthenticated()) {
    // if (!this.authUser.value) {
    //     await this.getUserLocalStorage();
    // }
    let isActive = false;
    if (authUser && authUser.user && authUser.user.state === 1) {
        isActive = true;
    }
    return isActive;
    // } else {
    //     return false;
    // }
}

export const getUserDevice = (devices: any[], device_user) => {
    const objNull = {
        id: null,
        phone_id: null,
        user_id: null
    };
    if (devices && devices.length > 0) {
        const userDevicesFilter = devices.filter((device: any) => device.phone_id === device_user.phone_id);
        if (userDevicesFilter.length === 0) {
            return objNull;
        } else {
            return userDevicesFilter[0];
        }
    } else {
        return objNull;
    }
}