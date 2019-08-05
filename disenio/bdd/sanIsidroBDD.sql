DROP DATABASE IF EXISTS sanisidrounido;

CREATE DATABASE IF NOT EXISTS sanisidrounido;

USE sanisidrounido ;

-- -----------------------------------------------------
-- Table users
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
id int(255) auto_increment not null,
firstname VARCHAR(25) NOT NULL,
lastname VARCHAR(45) NOT NULL,
email VARCHAR(50) NOT NULL,
avatar VARCHAR(50) NULL,
password VARCHAR(255) NULL,
state TINYINT NOT NULL,
basic_service_image VARCHAR(255) NULL,
number_phone VARCHAR(10) NULL,
CONSTRAINT pk_users PRIMARY KEY(id),
CONSTRAINT uq_email UNIQUE(email)
)ENGINE=InnoDb DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------
-- Table social_profiles
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS social_profiles (
id int(255) auto_increment not null,
user_id INT NOT NULL,
social_id VARCHAR(255) NOT NULL,
provider VARCHAR(255) NOT NULL,
  CONSTRAINT pk_social_profiles PRIMARY KEY(id),
  CONSTRAINT fk_social_profiles_user FOREIGN KEY(user_id) REFERENCES users(id)
)ENGINE=InnoDb DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------
-- Table devices
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS devices (
id int(255) auto_increment not null,
device_id VARCHAR(255) NOT NULL,
description TEXT NULL,
user_id INT NOT NULL,
  CONSTRAINT pk_devices PRIMARY KEY(id),
  CONSTRAINT fk_devices_user FOREIGN KEY(user_id) REFERENCES users(id)
)ENGINE=InnoDb DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------
-- Table public_services
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS public_services (
id int(255) auto_increment not null,
name VARCHAR(45) NOT NULL,
description TEXT NOT NULL,
ubication JSON NULL,
  CONSTRAINT pk_public_services PRIMARY KEY(id)
  )ENGINE=InnoDb DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------
-- Table phones
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS phones (
id int(255) auto_increment not null,
public_service_id INT NOT NULL,
phone_number VARCHAR(10) NOT NULL,
   CONSTRAINT pk_phones PRIMARY KEY(id),
   CONSTRAINT fk_phone_public_service FOREIGN KEY(public_service_id) REFERENCES public_services(id)
)ENGINE=InnoDb DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------
-- Table categories
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS categories (
id int(255) auto_increment not null,
name VARCHAR(45) NOT NULL,
slug VARCHAR(45) NOT NULL,
description TEXT(150) NULL,
  CONSTRAINT pk_categories PRIMARY KEY(id)
  )ENGINE=InnoDb DEFAULT CHARSET=utf8mb4;


-- -----------------------------------------------------
-- Table posts
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS posts (
id int(255) auto_increment not null,
title VARCHAR(45) NOT NULL,
description VARCHAR(256) NOT NULL,
date DATE NOT NULL,
time TIME NOT NULL,
ubication JSON NULL,
user_id INT NOT NULL,
category_id INT NOT NULL,
  CONSTRAINT pk_posts PRIMARY KEY(id),
  CONSTRAINT fk_posts_users FOREIGN KEY(user_id) REFERENCES users(id),
  CONSTRAINT fk_posts_categories FOREIGN KEY(category_id) REFERENCES categories(id)
  )ENGINE=InnoDb DEFAULT CHARSET=utf8mb4;


-- -----------------------------------------------------
-- Table imagenes
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS images (
id int(255) auto_increment not null,
url VARCHAR(256) NOT NULL,
post_id INT NOT NULL,
  CONSTRAINT pk_imagenes PRIMARY KEY(id),
 CONSTRAINT fk_imagenes_posts FOREIGN KEY(post_id) REFERENCES posts(id)
)ENGINE=InnoDb DEFAULT CHARSET=utf8mb4;


-- -----------------------------------------------------
-- Table subcategory
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS subcategories (
id int(255) auto_increment not null,
name VARCHAR(45) NOT NULL,
slug VARCHAR(45) NOT NULL,
description TEXT NULL,
category_id INT NOT NULL,
  CONSTRAINT pk_subcategory PRIMARY KEY(id),
  CONSTRAINT fk_subcategory_of_category FOREIGN KEY(category_id) REFERENCES categories(id)
)ENGINE=InnoDb DEFAULT CHARSET=utf8mb4;


-- -----------------------------------------------------
-- Table roles
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS roles (
id int(255) auto_increment not null,
name VARCHAR(255) NOT NULL,
slug VARCHAR(255) NOT NULL,
description TEXT NULL,
CONSTRAINT pk_roles PRIMARY KEY(id)
)ENGINE=InnoDb DEFAULT CHARSET=utf8mb4;


-- -----------------------------------------------------
-- Table permissions
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS permissions (
id int(255) auto_increment not null,
name VARCHAR(255) NOT NULL,
slug VARCHAR(255) NOT NULL,
description TEXT NULL,
  CONSTRAINT pk_permissions PRIMARY KEY(id)
  )ENGINE=InnoDb DEFAULT CHARSET=utf8mb4;


-- -----------------------------------------------------
-- Table role_user
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS role_user (
id int(255) auto_increment not null,
user_id INT NOT NULL,
role_id INT NOT NULL,
position VARCHAR(10) NULL,
CONSTRAINT pk_role_user PRIMARY KEY(id),
CONSTRAINT fk_roles_to_user FOREIGN KEY(role_id) REFERENCES roles(id),
CONSTRAINT fk_users_from_role FOREIGN KEY(user_id) REFERENCES users(id)
)ENGINE=InnoDb DEFAULT CHARSET=utf8mb4;


-- -----------------------------------------------------
-- Table permission_user
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS permission_user (
id int(255) auto_increment not null,
user_id INT NOT NULL,
permission_id INT NOT NULL,
CONSTRAINT pk_permission_user PRIMARY KEY(id),
  CONSTRAINT fk_users_has_permissions_permissions FOREIGN KEY(permission_id) REFERENCES permissions(id),
  CONSTRAINT fk_users_has_permissions_users FOREIGN KEY(user_id) REFERENCES users(id)
)ENGINE=InnoDb DEFAULT CHARSET=utf8mb4;


-- -----------------------------------------------------
-- Table permission_role
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS permission_role (
id int(255) auto_increment not null,
role_id INT NOT NULL,
permission_id INT NOT NULL,
CONSTRAINT pk_permission_role PRIMARY KEY(id),
CONSTRAINT fk_roles_has_permissions_permissions FOREIGN KEY(permission_id) REFERENCES permissions(id),
CONSTRAINT fk_roles_has_permissions_roles FOREIGN KEY(role_id) REFERENCES roles(id)
)ENGINE=InnoDb DEFAULT CHARSET=utf8mb4;


-- -----------------------------------------------------
-- Table detalle
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS details (
id int(255) auto_increment not null,
post_id INT NOT NULL,
user_id INT NOT NULL,
date DATE NULL,
time TIME NULL,
like_count TINYINT NULL,
attendance TINYINT NULL,
nonattendance TINYINT NULL,
CONSTRAINT pk_details PRIMARY KEY(id),
CONSTRAINT fk_details_posts FOREIGN KEY(post_id) REFERENCES posts(id),
CONSTRAINT fk_details_users FOREIGN KEY(user_id) REFERENCES users(id),
CONSTRAINT uq_detail_post_id UNIQUE(post_id)
)ENGINE=InnoDb DEFAULT CHARSET=utf8mb4;
