CREATE TABLE IF NOT EXISTS Usuarios(
    id_usuario bigint,
    nombre varchar(200),
    contraseña varchar(200),
    mail varchar(200) UNIQUE,
    PRIMARY KEY(id_usuario)
);

CREATE TABLE IF NOT EXISTS Chats(
    id_chat int AUTO_INCREMENT,
    nombre varchar(200),
    es_grupo bool,
    PRIMARY KEY(id_chat)
);

CREATE TABLE IF NOT EXISTS Usuarios_Chats(
    id_usuario bigint,
    id_chat int,
    PRIMARY KEY(id_usuario, id_chat),
    FOREIGN KEY(id_usuario) REFERENCES Usuarios(id_usuario),
    FOREIGN KEY(id_chat) REFERENCES Chats(id_chat)
);

CREATE TABLE IF NOT EXISTS Mensajes(
    id_mensaje int AUTO_INCREMENT,
    id_chat int,
    id_usuario bigint,
    contenido varchar(10000),
    hora datetime,
    PRIMARY KEY(id_mensaje),
    FOREIGN KEY(id_chat) REFERENCES Chats(id_chat),
    FOREIGN KEY(id_usuario) REFERENCES Usuarios(id_usuario)
);