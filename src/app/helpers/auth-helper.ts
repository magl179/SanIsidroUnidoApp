import { JwtHelperService } from "@auth0/angular-jwt";

// Decodificar el Token
export const decodeToken = (token: string) => {
    let decodedToken = null;
    try {
        const helper = new JwtHelperService();
        decodedToken = helper.decodeToken(token);
    } catch (token_error) {
       return null;
    }
    return decodedToken;
}
// Validar si el token ha expirado
export const tokenIsExpired = (token: string) => {
    const helper = new JwtHelperService();
    const isExpired = helper.isTokenExpired(token);
    return isExpired;
}