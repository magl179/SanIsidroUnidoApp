import { IUser, ITokenDecoded, IRole, IReaction, IDeviceUser } from '../interfaces/models';

// Function obtener los detalles de un usuario
export const getUsersFromDetails = (reactions: IReaction[]) => {
    return reactions.map((reaction: IReaction) => reaction.user_id);
}

// Funcion para verificar si un usuario ha dado like o asistencia en un detalle de un post
export const checkUserInDetails = (user_id: number, users_id: number[]) => {
    return users_id.includes(user_id);
}

//Funcion verifica like en un posts
export const checkLikePost = (reactions: IReaction[], user_authenticated: IUser) => {
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
export const getUserRoles = (sessionAuth: ITokenDecoded) => {
    return (sessionAuth && sessionAuth.user) ? sessionAuth.user.roles.map((role: IRole) => role.slug) : [];
}

// Verificar si un usuario tiene unos roles en especifico
export const hasRoles = (userRoles: string[], allowedRoles: string[]) => {
    let hasRole = false;
    for (const oneRole of allowedRoles) {
        if (userRoles.includes(oneRole.toLowerCase())) {
            hasRole = true;
        }
    }
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