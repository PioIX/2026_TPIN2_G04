CREATE TABLE IF NOT EXISTS Mensajes(
	id_mensaje int auto_increment unique NOT null,
    usuario varchar(200),
    contenido varchar(10000),
    hora datetime,
    PRIMARY KEY(id_mensaje)
);

CREATE TABLE IF NOT EXISTS Chats(
	id_chat int auto_increment unique NOT null,
    nombre varchar(200),
    es_grupo bool,
    id_mensaje int,
    PRIMARY KEY(id_chat),
    FOREIGN KEY(id_mensaje) REFERENCES Mensajes(id_mensaje)
);

CREATE TABLE IF NOT EXISTS Usuarios(
	id_usuario int,
    nombre varchar(200),
    contraseña varchar(200),
    mail varchar(200),
    id_chat int,
    PRIMARY KEY(id_usuario),
    FOREIGN KEY(id_chat) REFERENCES Chats(id_chat)
);