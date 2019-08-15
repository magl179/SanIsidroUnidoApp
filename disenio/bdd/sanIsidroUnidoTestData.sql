USE sanisidrounido;
/* INSERTAR REGISTROS EN LA TABLA USERS */
/* ID, FIRSTNAME, LASTNAME, EMAIL, AVATAR, PASSWORD, STATE, BASICSERVICEIMG, PHONE */
DROP TABLE IF EXISTS users;
INSERT INTO users  VALUES
(null,'Jose', 'Maza', 'jose@hotmail.com', 'https://www.w3schools.com/howto/img_avatar.png', 'jose123', 0, null,null, NOW(), NOW()),
(null,'Ana', 'Jimenez', 'ana@gmail.com', 'https://www.w3schools.com/howto/img_avatar2.png', null, 1, null,null, NOW(), NOW()),
(null,'Ramiro', 'Gonzales', 'ramiro@hotmail.com', 'https://www.w3schools.com/howto/img_avatar.png', null, 0, null,null, NOW(), NOW()),
(null,'Viviana', 'Bonilla', 'vivi97@hotmail.com', 'https://www.w3schools.com/howto/img_avatar2.png', 'jose123', 1, null,null, NOW(), NOW()),
(null,'Bolivar', 'Cumbicus', 'bolo@hotmail.com', null, '$2y$10$aGLxmyRbonnm8syxsol4JuF4a7qIQc2oNAkj/tTvbBHg06X0yvfPe', 1, null,null, NOW(), NOW());


/* INSERTAR REGISTROS EN LA TABLA ROLES */
-- id, name, slug, description
DROP TABLE IF EXISTS roles;
INSERT INTO roles VALUES
(null, 'Morador Afiliado', 'morador_afiliado', 'Rol de un morador afiliado', NOW(), NOW()),
(null, 'Morador Invitado', 'morador_afiliado', 'Rol de un morador invitado', NOW(), NOW()),
(null, 'Policia Comunitario', 'policia_comunitario', 'Rol de un policia comunitario', NOW(), NOW()),
(null, 'Directivo', 'directivo', 'Rol de un directivo normal', NOW(), NOW());


/* INSERTAR REGISTROS EN LA TABLA ROLE_USER */
-- id, user_id, role_id, position
INSERT into role_user VALUES
(null, 1, 3, 'Policia', NOW(), NOW()),
(null, 2, 2, '', NOW(), NOW()),
(null, 3, 1, '', NOW(), NOW()),
(null, 4, 2, '', NOW(), NOW()),
(null, 5, 2, '', NOW(), NOW());


/* INSERTAR REGISTROS EN LA TABLA SOCIAL PROFILES */
/* ID, USERID, SOCIALID, PROVIDER */
INSERT INTO social_profiles VALUES
(null, 2, '487asasd8a7ddldskfkds4', 'facebook', NOW(), NOW()),
(null, 3, 'sasa854sdyujhjhtf54çs', 'google', NOW(), NOW());


/* INSERTAR REGISTROS EN LA TABLA DEVICES */
/* ID, deviceID, description, userid */
INSERT INTO devices VALUES
(null, 'sadasdsadsad', 'Samsung Galaxy J2', 2, NOW(), NOW());


/* INSERTAR REGISTROS EN LA TABLA PUBLIC SERVICES */
/* ID, name, description, ubication */
INSERT INTO public_services VALUES
(null, 'Centro Salud Pececitos', 'Centro de Salud Pececitos con la mejor atención al mejor precio', '{ "latitude": -0.5447547, "longitude": -447744, "address": ""}', NOW(), NOW()),
(null, 'Farmacia Centro Sana', 'Los mejores productos médicos con el mejor precio del mercado', '{ "latitude": -0.5447547, "longitude": -447744, "address": ""}', NOW(), NOW()),
(null, 'Ferreteria Broca Munich', 'Implementos Tecnologicos al mejor precio', '{ "latitude": -0.5447547, "longitude": -447744, "address": ""}', NOW(), NOW());


/* INSERTAR REGISTROS EN LA TABLA PHONES */
/* ID, publicserviceid, phonenumber */
INSERT INTO phones VALUES
(null, 1, '2684477',NOW(), NOW()),
(null, 2, '0988747470', NOW(), NOW());

/* INSERTAR REGISTROS EN LA TABLA CATEGORIES */
/* ID, name, slug, description */
INSERT INTO categories VALUES
(null, 'Emergencias', 'emergencies', 'Categoria para Publicaciones de Emergencia', NOW(), NOW()),
(null, 'Problemas Sociales', 'social_problems', 'Categoria para Publicaciones de Problemas de Emergencia', NOW(), NOW()),
(null, 'Eventos', 'events', 'Categoria para Publicaciones de Eventos', NOW(), NOW());

/* INSERTAR REGISTROS EN LA TABLA SUBCATEGORIES */
/*id,name, slug, description, category_id*/
INSERT into subcategories VALUES
(null, 'Transporte y Transito', 'transport_transit', 'SubCat Espacios Publicos', 2, NOW(), NOW()),
(null, 'Espacios Verdes', 'green_areas', 'SubCat Espacios Verdes', 2, NOW(), NOW()),
(null, 'Seguridad', 'security', 'SubCat Seguridad', 2, NOW(), NOW()),
(null, 'Proteccion Animal', 'animal_protection', 'Proteccion Animal', 2, NOW(), NOW());

/* INSERTAR REGISTROS EN LA TABLA POSTS */
/*ID, TITLE, DESCRIPTION, DATE, TIME, UBICATION, USER_ID, CATEGORY_ID*/
INSERT INTO posts VALUES
(null, 'Problema Social 1', 'Lorem Problema Social', CURDATE() , CURTIME(), '{ "latitude": -0.5447547, "longitude": -447744, "address": ""}', 1, 2, null,NOW(), NOW()),
(null, 'Emergencia 1', 'Lorem Emergencia 1', CURDATE() , CURTIME(), '{ "latitude": -0.5447547, "longitude": -447744, "address": ""}', 2, 1, 2, NOW(), NOW()),
(null, 'Evento 1', 'Lorem Evento 1', CURDATE() , CURTIME(), '{ "latitude": -0.5447547, "longitude": -447744, "address": ""}', 3, 3, 1, NOW(), NOW());


/* INSERTAR REGISTROS EN LA TABLA IMAGES */
/*id, url, post_id*/
INSERT INTO images VALUES
(null, 'https://images.pexels.com/photos/2182981/pexels-photo-2182981.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', 1, NOW(), NOW()),
(null, 'https://images.pexels.com/photos/2182981/pexels-photo-2182981.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', 2, NOW(), NOW()),
(null, 'https://images.pexels.com/photos/2182981/pexels-photo-2182981.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', 3, NOW(), NOW());





/* INSERTAR REGISTROS EN LA TABLA DETAILS */
/*INSERTAR REGISTROS EN LA TABLA DETAILS*/
/* id, post_id, user_id, date, time, like_count, attendance, nonattendance */
INSERT INTO details VALUES
(null, 1, 1, 'like', NOW(), NOW()),
(null, 2, 2, 'like', NOW(), NOW()),
(null, 3, 3, 'like', NOW(), NOW());

INSERT INTO mobile_notifications VALUES
(null,5, 'Noti1','Hola 1', 0, 'request_membership', NOW(), NOW()),
(null,5, 'Noti2', 'Hola 2', 0, 'request_membershi2p', NOW(), NOW()),
(null,5, 'Noti3', 'Hola 2', 0, 'request_membership3', NOW(), NOW());

