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

    // Función auxiliar para generar un número en el rango 1100000000 - 1199999999
    const generarTelefono = () => {
        return (Math.floor(Math.random() * (1199999999 - 1100000000 + 1)) + 1100000000).toString();
    };

    // Al cargar la página, asignamos el primer número
    useEffect(() => {
        setData(prevData => ({
            ...prevData,
            id_usuario: generarTelefono()
        }));
    }, []);

    // Función para actualizar el estado de "data" por cada modificación que haga el usuario en el input
    const handleChange = (e) => {
        setData({
            ...data, // Copia lo que ya había
            [e.target.name]: e.target.value // Cambia solo el campo actual
        });
    };

    const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
        setFotoFile(e.target.files[0]);
    }
};

    // Función para enviar los datos al backend (se ejecuta al hacer Submit)
const handleSubmit = (e) => {
    e.preventDefault(); // Evita que se recargue la página

    // Creamos FormData para adjuntar texto y el archivo de la foto
    const formData = new FormData();
    formData.append("id_usuario", data.id_usuario);
    formData.append("nombre", data.nombre);
    formData.append("contraseña", data.contraseña);
    formData.append("email", data.email);
    
    // Si el usuario seleccionó una foto, la adjuntamos
    if (fotoFile) {
        formData.append("foto", fotoFile);
    } else {
        formData.append("foto_defecto", foto_por_defecto)
    }

    fetch("http://localhost:4000/usuarios", { // Puerto 4000 del backend
        method: "POST",
        // NOTA: Se quita "Content-Type" para que el navegador maneje el archivo automáticamente
        body: formData // Mandamos el FormData con la foto y los datos
    })
        .then(response => response.json())
        .then(res => {
            alert("Usuario registrado con éxito");
            // Limpiamos el formulario y el archivo seleccionado
            setData({ id_usuario: "", nombre: "", contraseña: "", email: "" });
            setFotoFile(null);
        })
        .catch(error => console.error("Error:", error));
}


    return (
        <form onSubmit={handleSubmit}>
            <h2>Registro de Usuario</h2>

            <p>Al registrarte, este será tu número de teléfono: </p>
            <input
                type="number"
                name="id_usuario"
                value={data.id_usuario}
                readOnly
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
                type="text"
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