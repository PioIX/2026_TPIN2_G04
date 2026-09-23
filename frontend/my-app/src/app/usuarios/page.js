import { useState } from "react"

export default function PageUsuarios() {
    function agregarUsuario({ usuarios, setUsuarios }) {
        const [data, setData] = useState({
            id_usuario: "",
            nombre: "",
            contraseña: "",
            mail: ""
        });

        fetch("http://localhost:3001/usuarios", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(nuevoUsuario)
        })
            .then(response => response.json())
            .then(data => {
                setEstudiantes([...usuarios, data]);
                setFormData({ id_usuario: "", nombre: "", contraseña: "", mail: "" });
            });

        return (
            <>
                <input 
                type="number" 
                name="id_usuario"
                value="id_usuario"
                placeholder="Ingrese su número de telefono"/>

                <input 
                type="text" 
                name="nombre"
                value="nombre"
                placeholder="Ingrese su nombre"/>

                <input 
                type="text" 
                name="contraseña"
                value="contraseña"
                placeholder="Ingrese su contraseña"/>

                <input 
                type="text" 
                name="mail"
                value="mail"
                placeholder="Ingrese su email"/>


            </>
        )
    }
}

