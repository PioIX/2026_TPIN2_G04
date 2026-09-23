require("dotenv").config();
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const { Server } = require("socket.io");
const bodyParser = require('body-parser');
const { realizarQuery } = require('./modulos/mysql');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
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

app.post("/usuarios", async function(req, res){
    
    try {
        await realizarQuery(`INSERT INTO Usuarios (id_usuario, nombre, contraseña, mail) VALUES('${req.body.id_usuario}, ${req.body.nombre},${req.body.contraseña}, ${req.body.mail}')`)
        res.status(201).json({ mensaje: "Usuario creado con éxito" });
    } catch (error) {
        console.error("Error en /usuarios:", error); 
        res.status(500).json({ mensaje: "Hubo un error al crear el usuario" });
    }
    
    
    // const nuevoUsuario = {
    //     id_usuario: id_usuario,
    //     nombre: nombre,
    //     contraseña: contraseña,
    //     mail: mail
    //  }
    }
    


);