CREATE TABLE IF NOT EXISTS Usuarios_Chats (
    id_usuario BIGINT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    contraseña VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS Chats (
    id_chats INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NULL,
    es_grupo BOOLEAN DEFAULT 0,
    id_usuario BIGINT,
    FOREIGN KEY (id_usuario) REFERENCES Usuarios_Chats(id_usuario)
);

CREATE TABLE IF NOT EXISTS Mensajes (
    id_mensaje INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario BIGINT,
    contenido VARCHAR(10000),
    hora DATETIME,
    id_chat INT,
    FOREIGN KEY (id_chat) REFERENCES Chats(id_chats),
	FOREIGN KEY(id_usuario) REFERENCES Usuarios_Chats(id_usuario)
);