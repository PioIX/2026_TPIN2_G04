'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "../../componentes/Input";
import Boton from "../../componentes/Boton";

export default function PageLogin() {
    const router = useRouter();
    const [data, setData] = useState({ email: "", contraseña: "" });

    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        fetch("http://localhost:4000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(res => {
                        throw new Error(res.mensaje || "Error al iniciar sesión");
                    });
                }
                return response.json();
            })
            .then(res => {
                // Soportamos tanto 'id_usuario' como 'id' según cómo devuelva el backend
                const userId = res.id_usuario || res.id;
                
                const foto = localStorage.getItem(`foto_${userId}`) || "/default-foto.jpg";

                // Guardamos la sesión del usuario
                localStorage.setItem("usuario", JSON.stringify({ ...res, id_usuario: userId, foto }));

                // Redirigimos a la vista de chats
                router.push("/chats");
            })
            .catch(error => {
                alert(error.message);
            });
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Iniciar sesión</h2>

            <Input
                type="email"
                name="email"
                value={data.email}
                onChange={handleChange}
                placeholder="Ingrese su email"
            />

            <Input
                type="password"
                name="contraseña"
                value={data.contraseña}
                onChange={handleChange}
                placeholder="Ingrese su contraseña"
            />

            <Boton type="submit" text="Ingresar" />
        </form>
    );
}