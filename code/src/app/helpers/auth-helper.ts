// import { Storage } from '@ionic/storage';
import { JwtHelperService } from "@auth0/angular-jwt";
// import { StorageService } from '../services/storage.service';

// const storage = StorageService;


// Decodificar el Token
export const decodeToken = (token: any) => {
    let decodedToken = null;
    try {
        const helper = new JwtHelperService();
        decodedToken = helper.decodeToken(token);
    } catch (err) {
        console.log(err);
    }
    return decodedToken;
}
// Validar si el token ha expirado
export const tokenIsExpired = (token: any) => {
    const helper = new JwtHelperService();
    const isExpired = helper.isTokenExpired(token);
    return isExpired;
}