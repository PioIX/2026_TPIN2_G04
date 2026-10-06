'use client'

export default function ChatItem({ chat, onEliminar }) {
    const handleEliminar = () => {
        // Le avisamos a PageChats que borre este ID
        onEliminar(chat.id);
    }

    return (
        <li>
            {/* Botón de chat con foto de perfil y nombre */}
            <button type="button">
                <img 
                    src={chat.foto || "/default-foto.jpg"} 
                    width="20" 
                    height="20"
                    onError={(e) => {
                        e.target.src = "/default-foto.jpg";
                    }}
                    alt={chat.nombre}
                />
                <span>{chat.nombre}</span>  
            </button>

            {/* Botón para borrar chat */}
            <button onClick={handleEliminar}>
                Eliminar chat
            </button>
        </li>
    )
}