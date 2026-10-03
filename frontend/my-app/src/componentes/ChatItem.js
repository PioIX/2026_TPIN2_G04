'use client'

export default function ChatItem( { type = "button", foto, nombre, onClick} ) {

    return(
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
    )
}