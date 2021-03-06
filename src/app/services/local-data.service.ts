import { Injectable } from '@angular/core';
import { HttpRequestService } from "./http-request.service";
import { CedulaValidator } from '../helpers/cedula.validator';

@Injectable({
    providedIn: 'root'
})
export class LocalDataService {

    constructor(
    ) { }

    getFormValidations(){
        return {
            cedula: {
                required: true,
                minlength: 10,
                maxlength: 10,
                pattern: CedulaValidator
            },
            first_name: {
                required: true,
                minlength: 2,
                maxlength: 25,
                pattern: /^[a-zA-ZáéñÑíóúÁÉÍÓÚ ]+[a-zA-ZáéíñÑóúÁÉÍÓÚ ]+$/
            },
            last_name: {
                required: true,
                minlength: 2,
                maxlength: 25,
                pattern: /^[a-zA-ZáéñÑíóúÁÉÍÓÚ ]+[a-zA-ZáéíñÑóúÁÉÍÓÚ ]+$/
            },
            email: {
                required: true,
                minlength: 10,
                maxlength: 60
            },
            password: {
                required: true,
                minlength: 8,
                maxlength: 60,
                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,20}$/
            },
            password_confirm: {
                required: true,
                minlength: 8,
                maxlength: 60,
            },
            confirmPassword: {
                required: true,
                minlength: 8,
                maxlength: 60,
            },
            number_phone: {
                required: true,
                minlength: 7,
                maxlength: 10,
                pattern: /(^(09)[0-9]{8})+$|(^(02)[0-9]{7})+$/
            },
            title: {
                required: true,
                minlength: 3,
                maxlength: 150
            },
            description: {
                required: true,
                minlength: 3,
                maxlength: 1024
            },
            ubication: {
                description: {
                    required: true,
                    maxlength: 1024
                }
            },
            category: {
                required: true,
                minlength: 3,
                maxlength: 40
            },
            subcategory: {
                required: true,
                minlength: 3,
                maxlength: 40
            }
        }
    }

    getFormMessagesValidations(validations){
        return {
            cedula: {
                required: {
                    message: 'El Número de Cédula es Obligatorio'
                },
                minlength: {
                    message: `El Número de Cédula debe contener al menos ${validations.cedula.minlength} caracteres`
                },
                maxlength: {
                    message: `El Número de Cédula debe contener máximo ${validations.cedula.maxlength} caracteres`
                },
                cedulaValida: {
                    message: 'La cédula ingresada no es válida'
                }
            },
            first_name: {
                required: {
                    message: 'El Nombre es Obligatorio'
                },
                minlength: {
                    message: `El Nombre debe contener al menos ${validations.first_name.minlength} caracteres`
                },
                maxlength: {
                    message: `El Nombre debe contener máximo ${validations.first_name.maxlength} caracteres`
                },
                pattern: {
                    message: 'El Nombre no puede contener símbolos o caracteres especiales'
                }
            },
            last_name: {
                required: {
                    message: 'Los Apellidos son Obligatorios'
                },
                minlength: {
                    message: `Los Apellidos deben contener al menos ${validations.last_name.minlength} caracteres`
                },
                maxlength: {
                    message: `Los Apellidos deben contener máximo ${validations.last_name.maxlength} caracteres`
                },
                pattern: {
                    message: 'El Nombre no puede contener símbolos o caracteres especiales'
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
                    message: `El Email debe contener máximo ${validations.email.maxlength} caracteres`
                },
                pattern: {
                    message: `Ingresa un email válido`
                },
                email: {
                    message: 'Ingresa un email válido'
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
                    message: `La Contraseña debe contener máximo ${validations.password.maxlength} caracteres`
                },
                pattern: {
                    message: `Ingresa una contraseña segura`
                }
            },
            password_confirm: {
                required: {
                    message: 'La confirmación de contraseña es obligatoria'
                },
                minlength: {
                    message: `La confirmación de contraseña debe contener al menos ${validations.password.minlength} caracteres`
                },
                maxlength: {
                    message: `La confirmación de contraseña debe contener máximo ${validations.password.maxlength} caracteres`
                },
                mustMatch: {
                    message: `Las contraseñas no coinciden`
                }
            },
            number_phone: {
                required: {
                    message: 'El Número de Télefono es Obligatorio'
                },
                minlength: {
                    message: `El Número de Télefono debe contener al menos ${validations.number_phone.minlength} caracteres`
                },
                maxlength: {
                    message: `El Número de Télefono debe contener máximo ${validations.number_phone.maxlength} caracteres`
                },
                pattern: {
                    message: `Ingresa un número de teléfono válido`
                },
                telefonoValido: {
                    message: `Ingresa un número de teléfono válido`
                }
            },
            title: {
                required: {
                    message: 'El Título es Obligatorio'
                },
                minlength: {
                    message: `El Título debe contener al menos ${validations.title.minlength} caracteres`
                },
                maxlength: {
                    message: `El Título debe contener máximo ${validations.title.maxlength} caracteres`
                }
            },
            description: {
                required: {
                    message: 'La descripción es Obligatoria'
                },
                minlength: {
                    message: `La descripción debe contener al menos ${validations.description.minlength} caracteres`
                },
                maxlength: {
                    message: `La descripción debe contener máximo ${validations.description.maxlength} caracteres`
                }
            },
            category: {
                required: {
                    message: 'La Categoria es Obligatoria'
                },
                minlength: {
                    message: `La Categoria debe contener al menos ${validations.category.minlength} caracteres`
                },
                maxlength: {
                    message: `La Categoria debe contener máximo ${validations.category.maxlength} caracteres`
                }
            },
            subcategory: {
                required: {
                    message: 'La Subcategoria es Obligatoria'
                },
                minlength: {
                    message: `La Subcategoria debe contener al menos ${validations.subcategory.minlength} caracteres`
                },
                maxlength: {
                    message: `La Subcategoria debe contener máximo ${validations.subcategory.maxlength} caracteres`
                }
            },
            termconditions: {
                required: {
                    message: 'Por favor acepta los términos y condiciones'
                }
            },
            ubication: {
                description: {
                    required: {
                        message: `La descripción es requerida`
                    },
                    maxlength: {
                        message: `La descripción debe contener máximo ${validations.ubication.description.maxlength} caracteres`
                    }
                }
            }
        }
    }

}
