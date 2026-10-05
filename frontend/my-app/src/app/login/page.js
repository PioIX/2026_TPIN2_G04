
'use client'
import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "../../componentes/Input";
import Boton from "../../componentes/Boton";

export default function PageLogin() {
    const router = useRouter(); // manda al usuario a otra página después de loguearse
    const [data, setData] = useState({ email: "", contraseña: "" });
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

            fetch("http://localhost:4000/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            })
                .then(response => {
                    if (!response.ok) {
                        return response.json().then(res => {
                            throw new Error(res.mensaje);
                        });
                    }
                    return response.json();
                })
                .then(res => {
                    const foto = localStorage.getItem(`foto_${res.id_usuario}`) || "/default-foto.jpg"; //usa la foto q subió el usuario o la predeterminada
                    localStorage.setItem("usuario", JSON.stringify({ ...res, foto }));
                    router.push("/chats"); // cambia a chats
                })
                .catch(error => alert(error.message)); //aparece el erroer en pantalla si el usuario pone algun dato mal
        }

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