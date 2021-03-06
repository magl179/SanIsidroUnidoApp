export const MENU_ITEMS_APP = {
    "authenticated": [{
            "icon": "ios-home",
            "name": "Inicio",
            "redirectTo": "/home-list",
            "routeDirection": "root",
            "children": []
        },
        {
            "icon": "ios-person",
            "name": "Mi Perfil",
            "redirectTo": "/user-profile",
            "routeDirection": "root",
            "children": []
        },
        {
            "icon": "ios-information-circle",
            "name": "Información",
            "redirectTo": "/about",
            "routeDirection": "root",
            "children": []
        }
    ],
    "not_authenticated": [{
            "icon": "ios-home",
            "name": "Inicio",
            "redirectTo": "/home-list",
            "routeDirection": "root",
            "children": []
        },
        {
            "icon": "ios-information-circle",
            "name": "Información",
            "redirectTo": "/about",
            "routeDirection": "root",
            "children": []
        }
    ]
}