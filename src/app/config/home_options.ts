export const HOME_OPTIONS = [ 
    {
        "title": "Emergencias",
        "icon": "assets/img/svg/alarm.svg",
        "url": "/emergencies/categories",
        "isFunction": false,
        "valid_roles": ["morador", "policia"]
    },
    {
        "title": "Problemas Sociales",
        "icon": "assets/img/svg/protest.svg",
        "url": "/social-problems/categories",
        "isFunction": false,
        "valid_roles": ["morador", "policia"]
    },
    {
        "title": "Eventos",
        "icon": "assets/img/svg/calendar.svg",
        "url": "/events/categories",
        "isFunction": false,
        "valid_roles": ["morador", "invitado", "policia"]
    },
    {
        "title": "Servicios Públicos",
        "icon": "assets/img/svg/information-point.svg",
        "url": "/public-services",
        "isFunction": false,
        "valid_roles": ["morador", "invitado", "policia", "no_autenticado"]
    },
    {
        "title": "Directorio Barrial",
        "icon": "assets/img/svg/agenda.svg",
        "url": "/directory",
        "isFunction": false,
        "valid_roles": ["morador", "invitado", "policia", "no_autenticado"]
    },
    {
        "title": "Actividades Barriales",
        "icon": "assets/img/svg/analytics.svg",
        "url": "/reports/list",
        "isFunction": false,
        "valid_roles": ["morador", "invitado", "policia"]
    }
]