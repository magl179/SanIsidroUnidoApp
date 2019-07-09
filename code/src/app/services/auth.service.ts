import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Storage } from '@ionic/storage';
import { UserLogued } from 'src/app/interfaces/barrios';

const userAuthTB = 'pg_user_auth';

const defaultUser: UserLogued = {
    id: null,
    email: null,
    password: null,
    firstname: null,
    lastname: null,
    state: null,
    avatar: null,
    basic_service_image: null,
    cargo: null,
    phone: null
};

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    user = new BehaviorSubject(defaultUser);
    authState = new BehaviorSubject(false);

    constructor(
        private storage: Storage
    ) { }

    async login(email: string, password: string) {
        // recibir datos
        // llamar api loguear
        // recibir datos usuario

        // guardar usuario en storage
        // retornar error
        let loginCorrect = false;
        const userResult: UserLogued = {
            id: 5,
            email,
            password,
            firstname: 'Juan',
            lastname: 'Caceres',
            state: 'activo',
            avatar: 'assets/img/default/img_avatar.png',
            basic_service_image: '',
            cargo: 'Morador Afiliado',
            phone: ''
        };
        await this.storage.set(userAuthTB, userResult).then(res => {
            this.user.next(userResult);
            this.authState.next(true);
            loginCorrect = true;
        });
        return loginCorrect;
    }

    async register(firstname, lastname, email, password) {
        let registerCorrect = false;
        const userResult: UserLogued = {
            id: 5,
            email,
            password,
            firstname,
            lastname,
            state: 'activo',
            avatar: 'assets/img/default/img_avatar.png',
            basic_service_image: '',
            cargo: 'Morador Afiliado',
            phone: ''
        };
        await this.storage.set(userAuthTB, userResult).then(res => {
            this.user.next(userResult);
            this.authState.next(true);
            registerCorrect = true;
        });
        return registerCorrect;
    }

    logout() {
        return this.storage.remove(userAuthTB).then(res => {
            this.user.next(null);
            this.authState.next(false);
        });
    }

    async isAuthenticated() {
        await this.checkUser();
        return this.authState.value;
    }

    checkUser() {
        return this.storage.get(userAuthTB).then(res => {
            if (res) {
                this.user.next(res);
                this.authState.next(true);
            }
        });
    }
}
