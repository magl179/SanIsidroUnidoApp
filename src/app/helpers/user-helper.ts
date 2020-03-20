// Function obtener los detalles de un usuario
export const getUsersFromDetails = ($reactions: any) => {
    return $reactions.map((reaction: any) => reaction.user_id);
}

// Funcion para verificar si un usuario ha dado like o asistencia en un detalle de un post
export const checkUserInDetails = (user_id: number, users_id: number[]) => {
    return users_id.includes(user_id);
}

//Funcion verifica like en un posts
export const checkLikePost = (reactions: any, user_authenticated: any) => {
    if (user_authenticated && reactions && reactions.length > 0) {
        const likes_user = getUsersFromDetails(reactions);
        const user_made_like = checkUserInDetails(user_authenticated.id, likes_user);
        return user_made_like;
    }
    else {
        return false;
    }
}

//Obtener los Roles Usuario
export const getUserRoles = (sessionAuth: any) => {
    return (sessionAuth && sessionAuth.user) ? sessionAuth.user.roles.map((role: any) => role.slug) : [];
}

// Verificar si un usuario tiene unos roles en especifico
export const hasRoles = (userRoles: any[], allowedRoles: string[]) => {
    let hasRole = false;
    for (const oneRole of allowedRoles) {
        if (userRoles.includes(oneRole.toLowerCase())) {
            hasRole = true;
        }
    }
    // }
    return hasRole;
}


//Verificar si el usuario esta activo
export const isActive = async (authUser) => {
    let isActive = false;
    if (authUser && authUser.user && authUser.user.state === 1) {
        isActive = true;
    }
    return isActive;
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