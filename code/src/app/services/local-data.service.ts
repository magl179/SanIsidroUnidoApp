import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IMenuServices, IHomeOptions } from '../interfaces/models';
import { Observable } from 'rxjs';

// interface IHomeOptions {
//     title: string;
//     icon: string;
//     url: string;
//     valid_roles: string[];
// };

@Injectable({
    providedIn: 'root'
})
export class LocalDataService {

    constructor(
        private http: HttpClient
    ) { }

    getMenuOptions(): Observable<IMenuServices[]> {
        return this.http.get<IMenuServices[]>('/assets/data/menu.json');
    }
    
    getHomeOptions(): Observable<IHomeOptions[]> {
        return this.http.get<IHomeOptions[]>('/assets/data/home_options.json');
    }

    getFormValidations(){
        return {
            firstname: {
                required: true,
                minlength: 10,
                maxlength: 20
            },
            lastname: {
                required: true,
                minlength: 10,
                maxlength: 20
            },
            email: {
                required: true,
                minlength: 10,
                maxlength: 20
            },
            password: {
                required: true,
                minlength: 10,
                maxlength: 20,
                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,20}$/
            },
            password_confirm: {
                required: true,
                minlength: 8
            },
            phone: {
                required: true,
                minlength: 8,
                maxlength: 30
            }
        }
    }

    getFormMessagesValidations(validations){
        return {
            firstname: {
                required: {
                    message: 'El Nombre es Obligatorio'
                },
                minlength: {
                    message: `El Nombre debe contener al menos ${validations.firstname.minlength} caracteres`
                },
                maxlength: {
                    message: `El Nombre debe contener máximo ${validations.firstname.maxlength} caracteres`
                },
                pattern: {
                    message: 'Ingrese un nombre válido'
                }
            },
            lastname: {
                required: {
                    message: 'Los Apellidos son Obligatorios'
                },
                minlength: {
                    message: `Los Apellidos deben contener al menos ${validations.lastname.minlength} caracteres`
                },
                maxlength: {
                    message: `Los Apellidos deben contener máximo ${validations.lastname.maxlength} caracteres`
                },
                pattern: {
                    message: 'Ingrese un apellido válido'
                }
            },
            email: {
                required: {
                    message: 'El Email es Obligatorio'
                },
                minlength: {
                    message: `El Email debe contener al menos ${validations.email.minlength} caracteres`
                },
                maxlength: {
                    message: `El Email debe contener máximo ${validations.email.minlength} caracteres`
                },
                pattern: {
                    message: `Ingresa un email válido`
                }
            },
            password: {
                required: {
                    message: 'La Contraseña es Obligatoria'
                },
                minlength: {
                    message: `La Contraseña debe contener al menos ${validations.password.minlength} caracteres`
                },
                maxlength: {
                    message: `La Contraseña debe contener máximo ${validations.password.minlength} caracteres`
                },
                pattern: {
                    message: `Ingresa una contraseña segura`
                }
            },
            password_confirm: {
                required: {
                    message: 'La confirmación de contraseña es obligatoria'
                },
                mustMatch: {
                    message: `Las contraseñas no coinciden`
                }
            },
            phone: {
                required: {
                    message: 'El Número de Télefono es Obligatorio'
                },
                minlength: {
                    message: `El Número de Télefono debe contener al menos ${validations.password.minlength} caracteres`
                },
                maxlength: {
                    message: `El Número de Télefono debe contener máximo ${validations.password.minlength} caracteres`
                },
                pattern: {
                    message: `Ingresa una contraseña segura`
                }
            }
        }
    }

}
