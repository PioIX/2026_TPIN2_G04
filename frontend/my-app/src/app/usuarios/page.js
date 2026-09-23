import { useState } from "react"

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
            setFormData({ id_usuario: "", nombre: "", contraseña: "", mail: ""});
        });

    return (
        <>
            <input type="number" name="id_usuario" />
        </>
    )
}