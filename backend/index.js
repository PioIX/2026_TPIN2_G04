require('dotenv').config({ path: __dirname + '/pio.env' })

const express = require("express");
const cors = require("cors");
const session = require("express-session");
const { Server } = require("socket.io");
const bodyParser = require('body-parser');
const { realizarQuery } = require('./modulos/mysql');
const fs = require('fs');
const path = require('path');
const fileUpload = require('express-fileupload');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
}));
app.use(express.json());

const sessionMiddleware = session({
    secret: "supersarasa",
    resave: false,
    saveUninitialized: false,
});
app.use(sessionMiddleware);

const server = app.listen(PORT, () => {
    console.log(`Servidor NodeJS corriendo en http://localhost:${PORT}/`);
});

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3000", "http://localhost:3001"],
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    },
});

io.use((socket, next) => {
    sessionMiddleware(socket.request, {}, next);
});


io.on("connection", (socket) => {
    const req = socket.request;

    socket.on("joinRoom", (data) => {
        if (req.session.room != undefined && req.session.room.length > 0) {
            socket.leave(req.session.room);
        }
        req.session.room = data.room;
        socket.join(req.session.room);

        io.to(req.session.room).emit("chat-messages", {
            user: req.session.user,
            room: req.session.room,
        });
    });

    socket.on("sendMessage", (data) => {
        io.to(req.session.room).emit("newMessage", {
            room: req.session.room,
            message: data.message,
        });
    });

});

// Pedidos HTTP
// --- Usuarios
app.get("/usuarios", async function (req, res) {
    try {
        const usuarios = await realizarQuery(`SELECT id_usuario, nombre, contraseña, email FROM Usuarios`);
        res.status(200).json(usuarios);
    } catch (error) {
        console.error("Error al obtener usuarios:", error);
        res.status(500).json({ mensaje: "Hubo un error al obtener la lista de usuarios" });
    }
});


app.use(fileUpload());
// Nos aseguramos de que exista la carpeta 'uploads'
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

app.use('/uploads', express.static(uploadsDir));

app.post("/usuarios", async function (req, res) {
    try {
        if (req.files && req.files.foto) {
                const fotoArchivo = req.files.foto;
                const rutaGuardado = path.join(uploadsDir, `${req.body.id_usuario}.jpg`);
                
                // Guardamos la foto físicamente en la carpeta /uploads
                fotoArchivo.mv(rutaGuardado, (err) => {
                    if (err) console.error("Error al guardar imagen:", err);
                });
            }

        await realizarQuery(`INSERT INTO Usuarios (id_usuario, nombre, contraseña, email) VALUES
            ('${req.body.id_usuario}', '${req.body.nombre}', '${req.body.contraseña}', '${req.body.email}')`);
        const usuario = {
            id_usuario: req.body.id_usuario,
            nombre: req.body.nombre,
            email: req.body.email,
            foto: `http://localhost:4000/uploads/${req.body.id_usuario}.jpg`
        };
        req.session.user = usuario; //el backend se fija en la sesión del usuario que se acaba de crear
        res.status(201).json(usuario); 
    } catch (error) {
        console.error("Error en /usuarios:", error);
        res.status(500).json({ mensaje: "Hubo un error al crear el usuario" });
    }
});
app.post("/login", async function (req, res) {
    try {
        const { email, contraseña } = req.body;
        const resultado = await realizarQuery(
            `SELECT id_usuario, nombre, contraseña, email FROM Usuarios
            WHERE email = '${email}' AND contraseña = '${contraseña}'`
        );
        if (resultado.length === 0) {
            return res.status(401).json({ mensaje: "Email o contraseña incorrectos" });
        }
        req.session.user = resultado[0]; //si los datos son correctos, se guarda la sesion del usuario
        res.status(200).json(resultado[0]);
    } catch (error) {
        console.error("Error en /login:", error);
        res.status(500).json({ mensaje: "Hubo un error al iniciar sesión" });
    }
});

app.delete('/usuarios', async function (req, res) {
    try {
        let respuesta = await realizarQuery(`DELETE FROM Usuarios WHERE id_usuario = '${req.body.id_usuario}'`);
        res.status(200).json({ message: "Usuario eliminado" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al eliminar el usuario" });
    }
});

app.put('/usuarios', async function (req, res) {
    try {
        let respuesta = await realizarQuery(`UPDATE Usuarios SET nombre = '${req.body.nombre}', email = '${req.body.email}' WHERE id_usuario = '${req.body.id_usuario}'`);
        res.status(200).json({ message: "Usuario modificado" });
    } catch (error) {
        console.error("Error al modificar el usuario:", error);
        res.status(500).json({ mensaje: "Hubo un error al modificar el usuario" });
    }
});



// --- Chats
app.get("/chats", async function (req, res) {
    try {
        const chats = await realizarQuery(`SELECT id_chat, es_grupo, nombre, id_usuario FROM Chats`);
        res.status(200).json(chats);
    } catch (error) {
        console.log("Error al obtener chats:", error);
        res.status(500).json({ mensaje: "Hubo un error al obtener la lista de chats" });
    }
});

app.post("/chats", async function (req, res) {
    try {
        await realizarQuery(`INSERT INTO Chats (id_chat, es_grupo, nombre, id_usuario) VALUES
            ('${req.body.id_chat}', '${req.body.es_grupo}', '${req.body.nombre}', '${req.body.id_usuario}')`);
        res.status(201).json({ mensaje: "Chat creado con éxito" });
    } catch (error) {
        res.status(500).json({ mensaje: "Hubo un error al crear un nuevo chat" });
    }
});

app.delete('/chats', async function (req, res) {
    try {
        let respuesta = await realizarQuery(`DELETE FROM Chats WHERE id_chat = '${req.body.id_chat}'`);
        res.status(200).json({ message: "Chat eliminado" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al eliminar el chat" });
    }
});


// --- Mensajes
app.get("/mensajes", async function (req, res) {
    try {
        const mensajes = await realizarQuery(`SELECT id_mensaje, id_usuario, contenido, hora, id_chat FROM Mensajes`);
        res.status(200).json(mensajes);
    } catch (error) {
        console.log("Error al obtener mensajes:", error);
        res.status(500).json({ mensaje: "Hubo un error al obtener la lista de mensajes" });
    }
});

app.post("/mensajes", async function (req, res) {
    try {
        await realizarQuery(`INSERT INTO Mensajes (id_mensaje, id_usuario, contenido, hora, id_chat) VALUES
            ('${req.body.id_mensaje}', '${req.body.id_usuario}', '${req.body.contenido}', '${req.body.hora}', '${req.body.id_chat}')`);
        // CORREGIDO: Decía "Usuario creado con éxito"
        res.status(201).json({ mensaje: "Mensaje creado con éxito" });
    } catch (error) {
        res.status(500).json({ mensaje: "Hubo un error al crear un nuevo mensaje" });
    }
});

app.delete('/mensajes', async function (req, res) {
    try {
        // CORREGIDO: Se cambió 'id' por 'id_mensaje'
        let respuesta = await realizarQuery(`DELETE FROM Mensajes WHERE id_mensaje = '${req.body.id_mensaje}'`);
        res.status(200).json({ message: "Mensaje eliminado" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al eliminar el mensaje" });
    }
});

app.put('/mensajes', async function (req, res) {
    try {
        let respuesta = await realizarQuery(`UPDATE Mensajes SET contenido = '${req.body.contenido}' WHERE id_mensaje = '${req.body.id_mensaje}'`);
        res.status(200).json({ message: "Mensaje modificado" });
    } catch (error) {
        console.error("Error al modificar el mensaje:", error);
        res.status(500).json({ mensaje: "Hubo un error al modificar el mensaje" });
    }
});