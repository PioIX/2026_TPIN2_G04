'use client'

export default function ChatItem( { type = "button", foto, nombre, onClick, onEliminar} ) {
    

    return(
        <div>
            {/* Botón de chat con foto de perfil y nombre */}
            <button type={type} onClick={onClick}>
                <img 
                src={foto} 
                width="20" 
                height="20"
                onError={(e) => {
                    // Si la URL da 404 (no existe la foto en uploads/), carga la default
                    e.target.src = "/default-foto.jpg";
                }}
                />
                <span>{nombre}</span>  
            </button>

            {/* Boton para borrar chat */}
            <button
            onClick={onEliminar}>
            </button>
        </div>
    )
}