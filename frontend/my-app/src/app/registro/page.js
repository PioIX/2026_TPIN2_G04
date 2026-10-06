'use client'

import { useState, useEffect } from "react"

export default function PageRegistro() {

    const [data, setData] = useState({
        id_usuario: "",
        nombre: "",
        contraseña: "",
        email: ""
    });

    const foto_por_defecto = "/default-foto.jpg";
    const [fotoFile, setFotoFile] = useState(null);

    // Función para generar un número aleatorio
    const generarTelefono = () => {
        return (Math.floor(Math.random() * (1199999999 - 1100000000 + 1)) + 1100000000).toString();
    };

    // Al cargar el componente por primera vez, generamos el teléfono
    useEffect(() => {
        setData(prevData => ({
            ...prevData,
            id_usuario: generarTelefono()
        }));
    }, []);

    const handleChange = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        });
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFotoFile(e.target.files[0]);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault(); // Evita el recargado de página

        // 1. VALIDACIÓN DENTRO DEL SUBMIT
        if (!data.nombre) {
            alert("Ingrese su nombre de usuario");
            return; // Cortamos la ejecución si falla la validación
        }
        if (data.contraseña.length < 8) {
            alert("La contraseña debe contener al menos 8 caracteres");
            return; // Cortamos la ejecución si falla la validación
        }

        // 2. CREAR FORMDATA
        const formData = new FormData();
        formData.append("id_usuario", data.id_usuario);
        formData.append("nombre", data.nombre);
        formData.append("contraseña", data.contraseña);
        formData.append("email", data.email);
        
        if (fotoFile) {
            formData.append("foto", fotoFile);
        } else {
            formData.append("foto_defecto", foto_por_defecto);
        }

        // 3. ENVÍO AL BACKEND
        fetch("http://localhost:4000/usuarios", {
            method: "POST",
            body: formData
        })
            .then(response => response.json())
            .then(res => {
                alert("Usuario registrado con éxito");
                
                // 4. LIMPIAMOS CAMPOS Y GENERAMOS UN NUEVO TELÉFONO
                setData({ 
                    id_usuario: generarTelefono(), // <-- Generamos uno nuevo en lugar de dejarlo vacío ""
                    nombre: "", 
                    contraseña: "", 
                    email: "" 
                });
                setFotoFile(null);
            })
            .catch(error => console.error("Error:", error));
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Registro de Usuario</h2>

            <p>Al registrarte, este será tu número de teléfono: </p>
            <input
                type="text"
                name="id_usuario"
                value={data.id_usuario}
                readOnly
                placeholder="Generando número..."
            />

            <input
                type="text"
                name="nombre"
                value={data.nombre}
                onChange={handleChange}
                placeholder="Ingrese su nombre"
            />

            <input
                type="password"
                name="contraseña"
                value={data.contraseña}
                onChange={handleChange}
                placeholder="Ingrese su contraseña"
            />

            <input
                type="email"
                name="email"
                value={data.email}
                onChange={handleChange}
                placeholder="Ingrese su email"
            />

            <div style={{ marginTop: "10px", marginBottom: "10px" }}>
                <label>Foto de Perfil (Opcional):</label>
                <input
                    type="file"
                    accept="image/*"
                    name="foto"
                    onChange={handleFileChange}
                />
            </div>

            <button type="submit">Registrarse</button>

        </form>
    )
}