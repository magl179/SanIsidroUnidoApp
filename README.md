# Repositorio de la Parte Móvil del Proyecto San Isidro Unido

## Objetivo

El objetivo del proyecto es implementar los conocimientos aprendidos durante toda la carrera de Análisis de Sistemas Informáticos, brindando al cliente un producto de valor.

## Descripción

La Aplicación Móvil permitira a los usuarios:

- Registro y Login por Formulario, Facebook o Google
- Solicitar Afiliación al Barrio
- Visualizar Listado de Servicios Públicos presentes en el Barrio
- Reportar Emergencias
- Reportar Problemas Sociales
- Listar Problemas Sociales
- Listar Eventos Barriales
- Visualizar un Directorio con los datos personales de la directiva barrial
- Editar Perfil y Cambiar Contraseña


## Características generales
 La aplicación está hecha en Ionic 4 teniendo como target el API 28, como mínimo el 19

## Directorios

Se incluyen los siguientes directorios:

- Disenio: PDF y Balsamiq Project con el diseño de la interfaz móvil
- Code: Código fuente de la aplicación móvil

## Datos Extras

| Universidad  | Facultad | Beneficiario |
| ------ | ------ | ------ |
| Universidad Politécnica Nacional | Escuela de Formación de Tecnólogos | Barrio San Isidro de Puengasi |

# Docente Tutor 
| Nombre  | Email |
| ------ | ------ |
| Ing. Byron Loarte | byron.loarteb@epn.edu.ec |

## Desarrolladores

| Nombre  | Email |
| ------ | ------ |
| Stalin Maza | stalinct97@gmail.com |
| Josué Cando | josuericardocando@gmail.com |

## Recomendaciones

- Para poder observar la aplicación de la mejor manera se debe tener el Navegador con el WebView actualizado
- Modo Dev: agregar ips en archivo "code\resources\android\xml\network_security_config.xml" para evitar problemas cors

# Validaciones

### Validar Contraseña

La validación verifica que la contraseña ingresada sea mínimo 8 caracteres y máximo 20 en donde se debe ingresar mínimo una letra mayúscula, una letra minúscula, un numero y un carácter especial

```php

```

/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,20}$/g/

```

```

### Mejoras en iOS
https://reviblog.net/2017/09/06/como-mejorar-el-rendimiento-de-ionic-en-ios-y-solucion-al-problema-de-las-peticiones-http-cors/