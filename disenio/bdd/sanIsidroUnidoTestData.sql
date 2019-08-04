/* ID, FIRSTNAME, LASTNAME, EMAIL, AVATAR, PASSWORD, STATE, BASICSERVICEIMG, PHONE */
/* (firstname, lastname, email, avatar, password, state, basic_service_image, number_phone) */
INSERT INTO users  VALUES
(null,'Jose', 'Maza', 'jose@hotmail.com', 'https://www.w3schools.com/howto/img_avatar.png', 'jose123', 0, '', ''),
(null,'Ana', 'Jimenez', 'ana@gmail.com', 'https://www.w3schools.com/howto/img_avatar2.png', null, 1, '', ''),
(null,'Ramiro', 'Gonzales', 'ramiro@hotmail.com', 'https://www.w3schools.com/howto/img_avatar.png', null, 0, '', ''),
(null,'Viviana', 'Bonilla', 'vivi97@hotmail.com', 'https://www.w3schools.com/howto/img_avatar2.png', 'jose123', 1, '', '');
/* ID, USERID, SOCIALID, PROVIDER */
INSERT INTO social_profiles VALUES
(null, 2, '487asasd8a7ddldskfkds4', 'facebook'),
(null, 3, 'sasa854sdyujhjhtf54çs', 'google');
/* ID, deviceID, description, userid */
INSERT INTO devices VALUES
(null, 'sadasdsadsad', 'Samsung Galaxy J2', 2);
/* ID, name, description, ubication */
INSERT INTO public_services VALUES
(null, 'Centro Salud Pececitos', 'Centro de Salud Pececitos con la mejor atención al mejor precio', "{ lat: -0.5447547, lng: -447744, address: ''}"),
(null, 'Farmacia Centro Sana', 'Los mejores productos médicos con el mejor precio del mercado', "{ lat: -0.5447547, lng: -447744, address: ''}"),
(null, 'Ferreteria Broca Munich', 'Implementos Tecnologicos al mejor precio', "{ lat: -0.5447547, lng: -447744, address: ''}");
/* ID, publicserviceid, phonenumber */
INSERT INTO phones VALUES
(null, 1, '2684477'),
(null, 2, '0988747470');
/* ID, name, slug, description */
INSERT INTO categories VALUES
(null, 'Emergencias', 'emergencies', 'Categoria para Publicaciones de Emergencia'),
(null, 'Problemas Sociales', 'social_problems', 'Categoria para Publicaciones de Problemas de Emergencia'),
(null, 'Eventos', 'events', 'Categoria para Publicaciones de Eventos');
/*ID, TITLE, DESCRIPTION, DATE, TIME, UBICATION, USER_ID, CATEGORY_ID*/
INSERT INTO posts VALUES
(null, 'Problema Social 1', 'Lorem Problema Social', CURDATE() , CURTIME(), "{ lat: -0.5447547, lng: -447744, address: ''}", 1, 2),
(null, 'Emergencia 1', 'Lorem Emergencia 1', CURDATE() , CURTIME(), "{ lat: -0.5447547, lng: -447744, address: ''}", 2, 1),
(null, 'Evento 1', 'Lorem Evento 1', CURDATE() , CURTIME(), "{ lat: -0.5447547, lng: -447744, address: ''}", 3, 3);
/*id, url, post_id*/
INSERT INTO images VALUES
(null, 'https://images.pexels.com/photos/2182981/pexels-photo-2182981.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', 1),
(null, 'https://images.pexels.com/photos/2182981/pexels-photo-2182981.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', 2),
(null, 'https://images.pexels.com/photos/2182981/pexels-photo-2182981.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', 3);
/*id,name, slug, description, category_id*/
INSERT into subcategories VALUES
(null, 'Transporte y Transito', 'transport_transit', 'SubCat Espacios Publicos', 1),
(null, 'Espacios Verdes', 'green_areas', 'SubCat Espacios Verdes', 1),
(null, 'Seguridad', 'security', 'SubCat Seguridad', 1),
(null, 'Proteccion Animal', 'animal_protection', 'Proteccion Animal', 1);
/* id, post_id, user_id, date, time, like_count, attendance, nonattendance */
INSERT INTO details VALUES
(null, 1, 1, CURDATE(), CURTIME(), null, null, null),
(null, 2, 2, CURDATE(), CURTIME(), null, null, null),
(null, 3, 3, CURDATE(), CURTIME(), null, null, null);

